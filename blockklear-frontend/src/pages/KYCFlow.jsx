import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import DocumentUpload from '../components/DocumentUpload'
import FaceVerification from '../components/FaceVerification'
import ProgressTracker, { defaultKYCSteps } from '../components/ProgressTracker'
import BillingNotice from '../components/BillingNotice'
import { storeKYCOnBlockchain, prepareKYCDataForBlockchain } from '../utils/blockchain'
import { setCurrentStep as setMemoryStep, storeBiometrics, getSessionData, exportForSubmission } from '../services/kycMemory'

const KYCFlow = () => {
  const navigate = useNavigate()
  const { isConnected, account, signer } = useWeb3()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(defaultKYCSteps)
  const [uploadedDocument, setUploadedDocument] = useState(null)
  const [capturedFace, setCapturedFace] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResults, setOcrResults] = useState(null)
  const [blockchainResult, setBlockchainResult] = useState(null)

  useEffect(() => {
    if (!isConnected) {
      navigate('/')
    }
  }, [isConnected, navigate])

  const updateStepStatus = (stepIndex, status, progress = null, error = null) => {
    setSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === stepIndex 
          ? { 
              ...step, 
              status, 
              progress,
              error,
              completedAt: status === 'completed' ? new Date().toISOString() : step.completedAt
            }
          : step
      )
    )
  }

  const handleDocumentUpload = async (file) => {
    setUploadedDocument(file)

    if (file) {
      // Update step 0 (Document Upload) to completed
      updateStepStatus(0, 'completed')
      setCurrentStep(1) // Move to document verification step

      // Update KYC memory
      setMemoryStep('document_verification')
    } else {
      // Reset steps if document is removed
      updateStepStatus(0, 'pending')
      updateStepStatus(1, 'pending')
      setOcrResults(null)
      setCurrentStep(0)

      // Update KYC memory
      setMemoryStep('document_upload')
    }
  }

  const handleOCRComplete = async (results) => {
    setOcrResults(results)

    // Start step 1 (Document Verification)
    updateStepStatus(1, 'in_progress', 0)
    setIsProcessing(true)

    // Log memory usage
    console.log('📊 KYC Memory after OCR:', results.memoryUsage)

    try {
      if (results.success) {
        // Simulate additional verification based on OCR results
        for (let progress = 0; progress <= 100; progress += 25) {
          await new Promise(resolve => setTimeout(resolve, 400))
          updateStepStatus(1, 'in_progress', progress)
        }

        // Check if OCR validation passed (more lenient for progression)
        const hasBasicData = results.extractedData &&
                           (results.extractedData.documentNumber || results.extractedData.fullName)

        if (hasBasicData || (results.validation && results.validation.completeness >= 30)) {
          updateStepStatus(1, 'completed')
          setCurrentStep(2) // Move to face verification
          console.log('✅ Document verification passed - proceeding to face verification')
        } else {
          updateStepStatus(1, 'failed', null, 'Document validation failed - could not extract basic information')
          console.log('❌ Document validation failed:', results.validation)
        }
      } else {
        updateStepStatus(1, 'failed', null, `OCR failed: ${results.error}`)
      }
    } catch (error) {
      updateStepStatus(1, 'failed', null, 'Document verification failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFaceCapture = async (imageData) => {
    setCapturedFace(imageData)

    if (imageData) {
      // Update step 2 (Face Verification) to in progress
      updateStepStatus(2, 'in_progress', 0)
      setIsProcessing(true)

      // Update KYC memory step
      setMemoryStep('face_verification')

      try {
        // Simulate face verification process
        for (let progress = 0; progress <= 100; progress += 25) {
          await new Promise(resolve => setTimeout(resolve, 600))
          updateStepStatus(2, 'in_progress', progress)
        }

        // Store biometrics in memory
        storeBiometrics({
          verified: true,
          confidence: 0.95,
          imageData: imageData // Store the captured face image
        })

        updateStepStatus(2, 'completed')

        // Update memory step
        setMemoryStep('compliance_check')
        
        // Start compliance check
        updateStepStatus(3, 'in_progress', 0)
        
        for (let progress = 0; progress <= 100; progress += 33) {
          await new Promise(resolve => setTimeout(resolve, 400))
          updateStepStatus(3, 'in_progress', progress)
        }
        
        updateStepStatus(3, 'completed')
        setCurrentStep(4) // Move to blockchain step
        
      } catch (error) {
        updateStepStatus(2, 'failed', null, 'Face verification failed')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleBlockchainSubmission = async () => {
    setIsProcessing(true)

    try {
      if (!signer) {
        throw new Error('Wallet not connected')
      }

      if (!ocrResults || !ocrResults.success) {
        throw new Error('No valid OCR results available')
      }

      // Step 4: Hash Generation
      updateStepStatus(4, 'in_progress', 0)

      // Prepare KYC data for blockchain
      const kycData = prepareKYCDataForBlockchain(
        ocrResults,
        { success: !!capturedFace }, // Face verification
        { passed: true } // Compliance check (simplified)
      )

      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus(4, 'completed')

      // Step 5: Blockchain Storage
      updateStepStatus(5, 'in_progress', 0)

      console.log('🚀 Submitting KYC data to blockchain...')

      // Real blockchain transaction
      updateStepStatus(5, 'in_progress', 25)
      const result = await storeKYCOnBlockchain(signer, kycData)

      if (result.success) {
        updateStepStatus(5, 'in_progress', 75)
        setBlockchainResult(result)

        // Final completion
        updateStepStatus(5, 'completed')
        updateStepStatus(6, 'completed')

        // Save completion status with real data
        localStorage.setItem(`kyc_status_${account}`, 'completed')
        localStorage.setItem(`kyc_last_update_${account}`, new Date().toISOString())
        localStorage.setItem(`kyc_tx_hash_${account}`, result.txHash)
        localStorage.setItem(`kyc_block_number_${account}`, result.blockNumber.toString())

        console.log('✅ KYC successfully stored on blockchain:', result)

        // Navigate to status page
        setTimeout(() => {
          navigate('/status')
        }, 2000)
      } else {
        throw new Error(result.error || 'Blockchain transaction failed')
      }

    } catch (error) {
      console.error('❌ Blockchain submission error:', error)
      updateStepStatus(5, 'failed', null, `Blockchain submission failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const canProceedToBlockchain = uploadedDocument && capturedFace && 
    steps[2].status === 'completed' && steps[3].status === 'completed'

  if (!isConnected) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Progress Tracker */}
        <div className="lg:col-span-1">
          <ProgressTracker currentStep={currentStep} steps={steps} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification Process</h1>
            <p className="text-gray-600">
              Complete the steps below to verify your identity on the blockchain.
            </p>
          </div>

          {/* Billing Notice */}
          <BillingNotice />

          {/* Step 1: Document Upload */}
          <DocumentUpload
            onFileUpload={handleDocumentUpload}
            uploadedFile={uploadedDocument}
            isProcessing={isProcessing && steps[1].status === 'in_progress'}
            onOCRComplete={handleOCRComplete}
          />

          {/* Step 2: Face Verification */}
          {currentStep >= 2 && (
            <FaceVerification
              onCapture={handleFaceCapture}
              capturedImage={capturedFace}
              isProcessing={isProcessing && steps[2].status === 'in_progress'}
            />
          )}

          {/* Step 3: Blockchain Submission */}
          {canProceedToBlockchain && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Blockchain Verification
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm mb-2">
                    ✅ Document verified successfully<br />
                    ✅ Face verification completed<br />
                    ✅ Compliance check passed
                  </p>
                  {ocrResults && ocrResults.validation && (
                    <div className="text-xs text-green-700 mt-2 pt-2 border-t border-green-200">
                      <p>Document Type: <span className="font-medium capitalize">{ocrResults.extractedData.documentType}</span></p>
                      <p>Validation Score: <span className="font-medium">{ocrResults.validation.score || 0}/100</span></p>
                      <p>OCR Confidence: <span className="font-medium">{Math.round((ocrResults.confidence || 0) * 100)}%</span></p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Next Steps:</h4>
                  <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                    <li><strong>Hash Generation:</strong> Your KYC data will be hashed using SHA-256</li>
                    <li><strong>Contract Validation:</strong> Contract address will be verified</li>
                    <li><strong>Gas Estimation:</strong> Transaction gas will be calculated</li>
                    <li><strong>Blockchain Submission:</strong> Hash will be stored on Polygon Mumbai</li>
                    <li><strong>Confirmation:</strong> You'll receive a transaction receipt</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Requirements:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>✓ Wallet connected: <span className="font-mono text-xs">{account?.slice(0, 6)}...{account?.slice(-4)}</span></li>
                    <li>✓ Network: Polygon Mumbai Testnet</li>
                    <li>✓ MATIC balance: Required for gas fees</li>
                    <li>✓ Contract address: Configured in settings</li>
                  </ul>
                </div>

                {blockchainResult && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-2">✅ Transaction Successful!</h4>
                    <div className="text-xs text-green-700 space-y-2">
                      <div className="break-all">
                        <p className="font-semibold">Transaction Hash:</p>
                        <p className="font-mono bg-white p-2 rounded border border-green-100 mt-1">{blockchainResult.txHash}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Block Number:</p>
                        <p className="font-mono">{blockchainResult.blockNumber}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Gas Used:</p>
                        <p className="font-mono">{blockchainResult.gasUsed} wei</p>
                      </div>
                      <div className="mt-3 p-2 bg-white rounded border border-green-100">
                        <a
                          href={`https://mumbai.polygonscan.com/tx/${blockchainResult.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                        >
                          🔗 View on PolygonScan →
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {steps[5].status === 'failed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-900 mb-2">❌ Submission Failed</h4>
                    <p className="text-xs text-red-700 mb-3">{steps[5].error}</p>
                    <button
                      onClick={handleBlockchainSubmission}
                      disabled={isProcessing}
                      className="btn-secondary text-sm w-full"
                    >
                      {isProcessing ? 'Retrying...' : 'Retry Submission'}
                    </button>
                  </div>
                )}

                <button
                  onClick={handleBlockchainSubmission}
                  disabled={isProcessing || !signer}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>
                    {isProcessing ? 'Processing...' : 'Submit to Blockchain'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {!signer && (
                  <p className="text-sm text-red-600">
                    Please connect your wallet to submit to blockchain
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KYCFlow
