// Simple OCR test utility for OCR.space API
export const testOCRSpaceAPI = async () => {
  const API_KEY = import.meta.env.VITE_OCR_SPACE_API_KEY

  if (!API_KEY) {
    return { success: false, error: 'No OCR.space API key configured' }
  }

  // Create a simple test image with text
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 100
  const ctx = canvas.getContext('2d')

  // Draw white background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, 200, 100)

  // Draw black text
  ctx.fillStyle = 'black'
  ctx.font = '20px Arial'
  ctx.fillText('TEST 123', 50, 50)

  // Convert to base64 with data URI
  const base64Image = canvas.toDataURL('image/png')

  try {
    // Prepare form data for OCR.space API
    const formData = new FormData()
    formData.append('base64Image', base64Image)
    formData.append('language', 'eng')
    formData.append('isOverlayRequired', 'false')
    formData.append('OCREngine', '2')

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': API_KEY
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.ErrorMessage || `HTTP ${response.status}`,
        details: data
      }
    }

    const isSuccess = data.OCRExitCode === 1 || data.OCRExitCode === 2
    const hasText = data.ParsedResults &&
                   data.ParsedResults.length > 0 &&
                   data.ParsedResults[0].ParsedText &&
                   data.ParsedResults[0].ParsedText.trim().length > 0

    return {
      success: isSuccess,
      data: data,
      textFound: hasText,
      extractedText: data.ParsedResults?.[0]?.ParsedText || '',
      processingTime: data.ProcessingTimeInMilliseconds
    }

  } catch (error) {
    return {
      success: false,
      error: error.message,
      type: 'network_error'
    }
  }
}

// Legacy function name for backward compatibility
export const testGoogleVisionAPI = testOCRSpaceAPI
