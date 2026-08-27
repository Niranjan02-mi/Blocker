import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, RotateCcw, CheckCircle, AlertCircle, User } from 'lucide-react'

const FaceVerification = ({ onCapture, capturedImage, isProcessing }) => {
  const [isWebcamReady, setIsWebcamReady] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [useSimpleConstraints, setUseSimpleConstraints] = useState(false)
  const webcamRef = useRef(null)

  const videoConstraints = useSimpleConstraints 
    ? { facingMode: 'user' }
    : {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        facingMode: 'user'
      }

  const handleUserMedia = useCallback(() => {
    console.log('✅ Camera access granted successfully')
    setIsWebcamReady(true)
    setHasPermission(true)
    setError(null)
    setRetryCount(0)
  }, [])

  const handleUserMediaError = useCallback((error) => {
    console.error('❌ Camera Error Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    setHasPermission(false)
    setRetryCount(prev => prev + 1)
    
    let errorMessage = 'Camera access denied. Please allow camera access to continue.'
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera permission was denied. Please allow camera access when the browser asks.'
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera device found. Please ensure your camera is connected.'
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.'
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Camera access requires HTTPS or localhost. Please use a secure connection.'
    } else if (error.name === 'OverconstrainedError') {
      if (!useSimpleConstraints) {
        console.log('Retrying with simpler constraints...')
        setUseSimpleConstraints(true)
        setError(null)
        setHasPermission(null)
        return
      }
      errorMessage = 'Camera does not support required specifications.'
    }
    
    setError(errorMessage)
  }, [useSimpleConstraints])

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
    }
  }, [onCapture])

  const retake = () => {
    onCapture(null)
  }

  const handleRetry = () => {
    setError(null)
    setHasPermission(null)
    setIsWebcamReady(false)
    setUseSimpleConstraints(false)
  }

  if (hasPermission === false || error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
          <p className="text-gray-600 mb-4">
            {error || 'Please allow camera access to complete face verification.'}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleRetry}
              className="btn-primary"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (capturedImage) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Face Verification</h3>
          {!isProcessing && (
            <button
              onClick={retake}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured face"
              className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="text-sm font-medium">Verifying face...</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2 text-yellow-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                <span className="text-sm">Processing verification...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Face captured successfully</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Face Verification</h3>
      
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Face Verification Instructions:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Look directly at the camera</li>
                <li>Ensure good lighting on your face</li>
                <li>Remove glasses or hats if possible</li>
                <li>Keep your face centered in the frame</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Webcam */}
        <div className="relative">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
              mirrored={true}
              forceScreenshotSourceSize={true}
              imageSmoothing={true}
              onLoadingMetadata={() => console.log('Webcam metadata loaded')}
            />
            
            {!isWebcamReady && hasPermission !== false && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Requesting camera access...</p>
                </div>
              </div>
            )}
          </div>

          {/* Overlay guide */}
          {isWebcamReady && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Face outline guide */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-48 h-64 border-2 border-white border-dashed rounded-full opacity-70"></div>
                </div>
                
                {/* Corner guides */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white"></div>
              </div>
            </div>
          )}
        </div>

        {/* Capture button */}
        {isWebcamReady && (
          <div className="text-center">
            <button
              onClick={capture}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Camera className="h-5 w-5" />
              <span>Capture Photo</span>
            </button>
          </div>
        )}

        {/* Status indicator */}
        <div className="text-center">
          {!isWebcamReady && hasPermission && (
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
              <span className="text-sm">Initializing camera...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FaceVerification
