import { ethers } from 'ethers'
import CryptoJS from 'crypto-js'

// Contract ABI for KYCHashStore
export const KYC_CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "bytes32", "name": "_hash", "type": "bytes32"}],
    "name": "storeKYC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getKYCHash",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "hasKYC",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"},
      {"internalType": "bytes32", "name": "_hash", "type": "bytes32"}
    ],
    "name": "verifyKYC",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "bytes32", "name": "hash", "type": "bytes32"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "KYCStored",
    "type": "event"
  }
]

// Contract address - can be updated dynamically
// Your wallet: 0x34c9E1027590614B97473aa7Fa44bEb945dc2053
export let KYC_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

/**
 * Update the KYC contract address
 */
export const setKYCContractAddress = (address) => {
  if (address && address.startsWith('0x') && address.length === 42) {
    KYC_CONTRACT_ADDRESS = address
    console.log('✅ Contract Address Updated:', address)
  }
}

// Polygon Mumbai testnet configuration
export const POLYGON_MUMBAI_CONFIG = {
  chainId: '0x13881',
  chainName: 'Polygon Mumbai Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
}

/**
 * Generate SHA-256 hash from KYC data
 * @param {Object} kycData - The KYC data to hash
 * @returns {string} - The SHA-256 hash
 */
export const generateKYCHash = (kycData) => {
  // Create a normalized data object for consistent hashing
  const normalizedData = {
    documentType: kycData.documentType || '',
    documentNumber: kycData.documentNumber || '',
    fullName: kycData.fullName ? kycData.fullName.toUpperCase().trim() : '',
    dateOfBirth: kycData.dateOfBirth || '',
    expiryDate: kycData.expiryDate || '',
    nationality: kycData.nationality || '',
    gender: kycData.gender || '',
    faceVerified: Boolean(kycData.faceVerified),
    complianceCheck: Boolean(kycData.complianceCheck),
    ocrConfidence: kycData.ocrConfidence || 0,
    validationScore: kycData.validationScore || 0,
    timestamp: kycData.timestamp || new Date().toISOString()
  }

  // Sort keys for consistent hashing
  const sortedKeys = Object.keys(normalizedData).sort()
  const sortedData = {}
  sortedKeys.forEach(key => {
    sortedData[key] = normalizedData[key]
  })

  const dataString = JSON.stringify(sortedData)
  console.log('🔐 Generating hash for data:', dataString)

  return CryptoJS.SHA256(dataString).toString()
}

/**
 * Convert string hash to bytes32 format for Solidity
 * @param {string} hashString - The hash string
 * @returns {string} - The bytes32 formatted hash
 */
export const stringToBytes32 = (hashString) => {
  return '0x' + hashString
}

/**
 * Get contract instance with validation
 * @param {ethers.Signer} signer - The ethers signer
 * @returns {ethers.Contract} - The contract instance
 */
export const getKYCContract = (signer) => {
  // Load from localStorage first, then fall back to default
  const savedAddress = localStorage.getItem('KYC_CONTRACT_ADDRESS')
  const contractAddress = savedAddress || KYC_CONTRACT_ADDRESS
  
  console.log('📋 Using contract address:', contractAddress)
  
  if (!contractAddress || contractAddress === '0x1234567890123456789012345678901234567890') {
    console.warn('⚠️ Using mock contract address. Please configure the real contract address in settings.')
  }
  
  if (!signer) {
    throw new Error('Signer is not available. Please connect your wallet.')
  }
  
  return new ethers.Contract(contractAddress, KYC_CONTRACT_ABI, signer)
}

/**
 * Store KYC hash on blockchain with enhanced data
 * @param {ethers.Signer} signer - The ethers signer
 * @param {Object} kycData - Complete KYC data object
 * @returns {Promise<Object>} - Transaction result
 */
export const storeKYCOnBlockchain = async (signer, kycData) => {
  try {
    console.log('🔄 Starting blockchain submission...')
    
    // Validate inputs
    if (!signer) {
      throw new Error('Signer is not available. Please ensure wallet is connected.')
    }
    
    if (!kycData) {
      throw new Error('KYC data is required for blockchain submission.')
    }

    // Generate hash from the complete KYC data
    const hash = generateKYCHash(kycData)
    console.log('🔐 Generated hash:', hash)
    
    const contract = getKYCContract(signer)
    console.log('✅ Contract instance created')
    
    const bytes32Hash = stringToBytes32(hash)
    console.log('📝 Converted to bytes32:', bytes32Hash)

    console.log('🔗 Storing KYC data on blockchain:', {
      hash: hash,
      bytes32Hash: bytes32Hash,
      documentType: kycData.documentType,
      hasDocumentNumber: !!kycData.documentNumber,
      hasFullName: !!kycData.fullName,
      ocrConfidence: kycData.ocrConfidence,
      validationScore: kycData.validationScore
    })

    // Estimate gas with better error handling
    let gasLimit
    try {
      console.log('⛽ Estimating gas...')
      const gasEstimate = await contract.storeKYC.estimateGas(bytes32Hash)
      gasLimit = gasEstimate.mul(120).div(100) // Add 20% buffer
      console.log('📊 Gas Estimate:', gasEstimate.toString(), 'with buffer:', gasLimit.toString())
    } catch (gasError) {
      console.warn('⚠️ Gas estimation failed, using fallback:', gasError.message)
      // Use a reasonable default gas limit for storeKYC
      gasLimit = ethers.BigNumber.from('300000')
      console.log('📊 Using fallback gas limit:', gasLimit.toString())
    }

    // Send transaction
    console.log('📤 Sending transaction with gas limit:', gasLimit.toString())
    const tx = await contract.storeKYC(bytes32Hash, {
      gasLimit: gasLimit
    })

    console.log('📤 Transaction sent:', tx.hash)

    // Wait for confirmation
    console.log('⏳ Waiting for confirmation...')
    const receipt = await tx.wait()
    console.log('✅ Transaction confirmed:', receipt)

    return {
      success: true,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      hash: hash,
      kycData: {
        documentType: kycData.documentType,
        documentNumber: kycData.documentNumber ? '***' + kycData.documentNumber.slice(-4) : '',
        fullName: kycData.fullName ? kycData.fullName.split(' ')[0] + ' ***' : '',
        timestamp: kycData.timestamp
      }
    }
  } catch (error) {
    console.error('❌ Error storing KYC on blockchain:', {
      name: error.name,
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    })
    
    let errorMessage = error.message
    if (error.message?.includes('missing revert data')) {
      errorMessage = 'Contract call failed. Check if contract address is correct and deployed on the right network.'
    } else if (error.message?.includes('Cannot read properties of undefined')) {
      errorMessage = 'Contract or signer is undefined. Please ensure wallet is connected and contract address is configured.'
    } else if (error.message?.includes('gas')) {
      errorMessage = 'Gas estimation failed. Try adjusting gas settings or check wallet balance.'
    } else if (error.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient MATIC for transaction. Request more test tokens from the faucet.'
    } else if (error.message?.includes('ENS name')) {
      errorMessage = 'Invalid contract address format.'
    }
    
    return {
      success: false,
      error: errorMessage,
      details: {
        originalError: error.message,
        code: error.code
      }
    }
  }
}

/**
 * Prepare KYC data for blockchain submission
 * @param {Object} ocrResults - OCR results from document processing
 * @param {Object} faceVerification - Face verification results
 * @param {Object} complianceCheck - Compliance check results
 * @returns {Object} - Prepared KYC data
 */
export const prepareKYCDataForBlockchain = (ocrResults, faceVerification = {}, complianceCheck = {}) => {
  const kycData = {
    // Document data from OCR
    documentType: ocrResults.extractedData?.documentType || '',
    documentNumber: ocrResults.extractedData?.documentNumber || '',
    fullName: ocrResults.extractedData?.fullName || '',
    dateOfBirth: ocrResults.extractedData?.dateOfBirth || '',
    expiryDate: ocrResults.extractedData?.expiryDate || '',
    nationality: ocrResults.extractedData?.nationality || '',
    gender: ocrResults.extractedData?.gender || '',

    // Verification results
    faceVerified: faceVerification.success || false,
    complianceCheck: complianceCheck.passed || false,

    // Quality metrics
    ocrConfidence: ocrResults.confidence || 0,
    validationScore: ocrResults.validation?.score || 0,

    // Metadata
    timestamp: new Date().toISOString(),
    processingTime: ocrResults.processingTime || 0
  }

  console.log('📋 Prepared KYC data for blockchain:', {
    ...kycData,
    documentNumber: kycData.documentNumber ? '***' + kycData.documentNumber.slice(-4) : '',
    fullName: kycData.fullName ? kycData.fullName.split(' ')[0] + ' ***' : ''
  })

  return kycData
}

/**
 * Check if user has KYC verification
 * @param {ethers.Provider} provider - The ethers provider
 * @param {string} userAddress - The user's address
 * @returns {Promise<boolean>} - Whether user has KYC
 */
export const checkKYCStatus = async (provider, userAddress) => {
  try {
    const contract = new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, provider)
    return await contract.hasKYC(userAddress)
  } catch (error) {
    console.error('Error checking KYC status:', error)
    return false
  }
}

/**
 * Get KYC hash for user
 * @param {ethers.Provider} provider - The ethers provider
 * @param {string} userAddress - The user's address
 * @returns {Promise<string>} - The KYC hash
 */
export const getKYCHash = async (provider, userAddress) => {
  try {
    const contract = new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, provider)
    const hash = await contract.getKYCHash(userAddress)
    return hash
  } catch (error) {
    console.error('Error getting KYC hash:', error)
    return null
  }
}

/**
 * Verify KYC hash matches stored hash
 * @param {ethers.Provider} provider - The ethers provider
 * @param {string} userAddress - The user's address
 * @param {string} hashToVerify - The hash to verify
 * @returns {Promise<boolean>} - Whether hash matches
 */
export const verifyKYCHash = async (provider, userAddress, hashToVerify) => {
  try {
    const contract = new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, provider)
    const bytes32Hash = stringToBytes32(hashToVerify)
    return await contract.verifyKYC(userAddress, bytes32Hash)
  } catch (error) {
    console.error('Error verifying KYC hash:', error)
    return false
  }
}

/**
 * Switch to Polygon Mumbai testnet
 * @returns {Promise<boolean>} - Whether switch was successful
 */
export const switchToPolygonMumbai = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_MUMBAI_CONFIG.chainId }],
    })
    return true
  } catch (switchError) {
    // Chain not added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_MUMBAI_CONFIG],
        })
        return true
      } catch (addError) {
        console.error('Error adding network:', addError)
        return false
      }
    }
    console.error('Error switching network:', switchError)
    return false
  }
}
