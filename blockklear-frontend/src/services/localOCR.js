import { createWorker } from 'tesseract.js'

/**
 * Local OCR service using Tesseract.js
 * No API keys needed - runs completely in the browser
 */

let worker = null

/**
 * Initialize Tesseract worker
 */
const initializeWorker = async () => {
  if (worker) return worker

  console.log('🔧 Initializing Tesseract worker...')
  
  worker = await createWorker('eng')
  
  console.log('✅ Tesseract worker ready!')
  return worker
}

/**
 * Extract text from image using local Tesseract OCR
 * @param {File} imageFile - The image file to process
 * @returns {Promise<Object>} - OCR results
 */
export const extractTextFromImage = async (imageFile) => {
  try {
    console.log('🔍 Starting local OCR for:', imageFile.name)

    // Initialize worker if needed
    const ocrWorker = await initializeWorker()

    console.log('📄 Processing image with Tesseract...')
    
    // Run OCR on the image
    const { data: { text, confidence } } = await ocrWorker.recognize(imageFile)
    
    console.log('✅ OCR Complete!')
    console.log('📄 Extracted text:', text)
    console.log('📊 Confidence:', confidence)

    // Parse document data
    const extractedData = parseDocumentData(text)
    
    return {
      success: true,
      fullText: text,
      extractedData,
      confidence: confidence / 100 // Convert to 0-1 scale
    }

  } catch (error) {
    console.error('❌ Local OCR Error:', error)
    return {
      success: false,
      error: error.message,
      fullText: '',
      extractedData: null,
      confidence: 0
    }
  }
}

/**
 * Parse document data from extracted text
 */
const parseDocumentData = (text) => {
  if (!text) return null

  const lines = text.split('\n').map(line => line.trim()).filter(line => line)
  
  let documentType = 'UNKNOWN'
  let fullName = ''
  let documentNumber = ''
  let dateOfBirth = ''
  let expiryDate = ''

  // Detect document type
  const textUpper = text.toUpperCase()
  if (textUpper.includes('PASSPORT')) {
    documentType = 'PASSPORT'
  } else if (textUpper.includes('DRIVER') || textUpper.includes('LICENSE')) {
    documentType = 'DRIVERS_LICENSE'
  } else if (textUpper.includes('IDENTITY') || textUpper.includes('ID CARD')) {
    documentType = 'NATIONAL_ID'
  }

  // Extract name - look for patterns
  for (const line of lines) {
    const lineUpper = line.toUpperCase()
    
    // Look for name indicators
    if (lineUpper.includes('NAME') || lineUpper.includes('SURNAME')) {
      // Try to extract name from this line or next lines
      const nameMatch = line.match(/[A-Z][a-z]+ [A-Z][a-z]+/)
      if (nameMatch) {
        fullName = nameMatch[0]
        break
      }
    }
  }

  // If no name found with pattern, look for capitalized words
  if (!fullName) {
    for (const line of lines) {
      const words = line.split(' ')
      const capitalWords = words.filter(word => 
        word.length > 2 && 
        word[0] === word[0].toUpperCase() && 
        word.slice(1) === word.slice(1).toLowerCase() &&
        !word.includes('PASSPORT') &&
        !word.includes('LICENSE') &&
        !word.includes('CARD')
      )
      if (capitalWords.length >= 2) {
        fullName = capitalWords.slice(0, 2).join(' ')
        break
      }
    }
  }

  // Extract document number
  for (const line of lines) {
    const numberMatch = line.match(/[A-Z0-9]{6,}/)
    if (numberMatch && !numberMatch[0].includes('DATE')) {
      documentNumber = numberMatch[0]
      break
    }
  }

  // Extract dates
  const datePattern = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g
  const dates = text.match(datePattern) || []
  
  if (dates.length > 0) {
    dateOfBirth = dates[0]
  }
  if (dates.length > 1) {
    expiryDate = dates[1]
  }

  console.log('📋 Parsed document data:', {
    documentType,
    fullName,
    documentNumber,
    dateOfBirth,
    expiryDate
  })

  return {
    documentType,
    fullName,
    documentNumber,
    dateOfBirth,
    expiryDate,
    isValid: !!(fullName || documentNumber)
  }
}

/**
 * Test local OCR
 */
export const testOCRConnection = async () => {
  try {
    console.log('🧪 Testing local OCR...')
    
    // Create a simple test image
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    
    // White background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, 300, 100)
    
    // Black text
    ctx.fillStyle = 'black'
    ctx.font = '24px Arial'
    ctx.fillText('TEST DOCUMENT 123', 20, 50)
    
    // Convert to blob
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png')
    })
    
    const testFile = new File([blob], 'test.png', { type: 'image/png' })
    const result = await extractTextFromImage(testFile)
    
    return {
      success: result.success,
      extractedText: result.fullText,
      error: result.error
    }
    
  } catch (error) {
    console.error('🧪 Test failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Mock OCR service for fallback
 */
export const mockOCRService = async (file) => {
  console.log('🎭 Using mock OCR for:', file.name)
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    fullText: 'MOCK PASSPORT\nJOHN DOE\nP123456789\nDOB: 01/01/1990\nEXP: 01/01/2030',
    extractedData: {
      documentType: 'PASSPORT',
      fullName: 'JOHN DOE',
      documentNumber: 'P123456789',
      dateOfBirth: '01/01/1990',
      expiryDate: '01/01/2030',
      isValid: true
    },
    confidence: 0.95
  }
}

/**
 * Validate document data
 */
export const validateDocumentData = (data) => {
  if (!data) {
    return {
      isValid: false,
      errors: ['No data extracted'],
      warnings: []
    }
  }

  const errors = []
  const warnings = []

  if (!data.fullName) {
    errors.push('Full name not found')
  }
  
  if (!data.documentNumber) {
    errors.push('Document number not found')
  }

  if (!data.documentType || data.documentType === 'UNKNOWN') {
    warnings.push('Document type could not be determined')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Cleanup worker when done
 */
export const cleanup = async () => {
  if (worker) {
    await worker.terminate()
    worker = null
    console.log('🧹 Tesseract worker terminated')
  }
}
