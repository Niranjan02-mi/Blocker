import React, { useState } from 'react'
import { TestTube, Upload, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

const OCRTestPanel = () => {
  const [showPanel, setShowPanel] = useState(false)
  const [testResults, setTestResults] = useState(null)

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null
  }

  const runOCRTest = async () => {
    setTestResults({ testing: true })

    try {
      // Test if OCR.space API key is configured
      const hasApiKey = import.meta.env.VITE_OCR_SPACE_API_KEY &&
                       import.meta.env.VITE_OCR_SPACE_API_KEY.length > 0

      // Test mock OCR service
      const { mockOCRService } = await import('../services/ocrService')
      const mockResults = await mockOCRService(null)

      // Test OCR.space API if key is available
      let ocrSpaceTest = null
      if (hasApiKey) {
        const { testOCRSpaceAPI } = await import('../utils/testOCR')
        ocrSpaceTest = await testOCRSpaceAPI()
      }

      setTestResults({
        hasApiKey,
        mockOCR: mockResults.success,
        ocrSpaceEnabled: hasApiKey,
        ocrSpaceWorking: ocrSpaceTest?.success || false,
        ocrSpaceError: ocrSpaceTest?.error || null,
        extractedText: ocrSpaceTest?.extractedText || null,
        processingTime: ocrSpaceTest?.processingTime || null,
        timestamp: new Date().toLocaleTimeString()
      })
    } catch (error) {
      setTestResults({
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      })
    }
  }

  if (!showPanel) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowPanel(true)}
          className="bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="OCR Test Panel"
        >
          <TestTube className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
          <TestTube className="h-4 w-4" />
          <span>OCR Test Panel</span>
        </h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={runOCRTest}
          disabled={testResults?.testing}
          className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {testResults?.testing ? 'Testing...' : 'Run OCR Test'}
        </button>

        {testResults && !testResults.testing && (
          <div className="space-y-2 text-xs">
            <div className="bg-gray-50 rounded p-2">
              <p className="font-medium text-gray-700 mb-1">Test Results:</p>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>OCR.space API Key:</span>
                  <span className={`flex items-center space-x-1 ${
                    testResults.hasApiKey ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {testResults.hasApiKey ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>{testResults.hasApiKey ? 'Configured' : 'Not Set'}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Mock OCR:</span>
                  <span className={`flex items-center space-x-1 ${
                    testResults.mockOCR ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {testResults.mockOCR ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>{testResults.mockOCR ? 'Working' : 'Failed'}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>OCR.space API:</span>
                  <span className={`flex items-center space-x-1 ${
                    testResults.ocrSpaceWorking ? 'text-green-600' :
                    testResults.ocrSpaceEnabled ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {testResults.ocrSpaceWorking ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>
                      {testResults.ocrSpaceWorking ? 'Working' :
                       testResults.ocrSpaceEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </span>
                </div>

                {testResults.ocrSpaceError && (
                  <div className="mt-1 text-xs text-red-600">
                    API Error: {testResults.ocrSpaceError}
                  </div>
                )}

                {testResults.extractedText && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 text-xs">
                      <strong>Extracted Text:</strong> "{testResults.extractedText}"
                    </p>
                    {testResults.processingTime && (
                      <p className="text-green-700 text-xs mt-1">
                        Processing time: {testResults.processingTime}ms
                      </p>
                    )}
                  </div>
                )}
              </div>

              {testResults.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700">Error: {testResults.error}</p>
                </div>
              )}

              <p className="text-gray-500 mt-2">
                Last tested: {testResults.timestamp}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <p className="text-blue-800 text-xs">
                <strong>Current Mode:</strong> {testResults.hasApiKey ? 'Real OCR.space API' : 'Mock OCR'}
              </p>
              {!testResults.hasApiKey && (
                <p className="text-blue-700 text-xs mt-1">
                  Add VITE_OCR_SPACE_API_KEY to .env file to enable real OCR
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OCRTestPanel
