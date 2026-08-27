import React, { useState } from 'react'
import { AlertTriangle, ExternalLink, X, CreditCard } from 'lucide-react'

const BillingNotice = () => {
  // OCR.space API is now active - no billing notice needed
  return null

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            Google Vision API Billing Required
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            To use real OCR functionality, billing must be enabled on your Google Cloud project. 
            Currently using enhanced mock OCR for demonstration.
          </p>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <a
                href="https://console.developers.google.com/billing/enable?project=766632067774"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                <span>Enable Billing</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              
              <button
                onClick={() => setDismissed(true)}
                className="text-sm text-yellow-600 hover:text-yellow-800 underline"
              >
                Continue with Mock OCR
              </button>
            </div>
            
            <div className="text-xs text-yellow-600">
              <p><strong>Good news:</strong> OCR.space API has a generous free tier (25,000 requests/month)</p>
              <p><strong>Current mode:</strong> Enhanced mock OCR with realistic document processing</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-500 hover:text-yellow-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default BillingNotice
