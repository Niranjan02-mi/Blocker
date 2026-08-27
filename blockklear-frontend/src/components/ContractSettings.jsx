import React, { useState, useEffect } from 'react'
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { setKYCContractAddress, KYC_CONTRACT_ADDRESS } from '../utils/blockchain'

const ContractSettings = () => {
  const [contractAddress, setContractAddress] = useState('')
  const [walletAddress] = useState('0x34c9E1027590614B97473aa7Fa44bEb945dc2053')
  const [saveMessage, setSaveMessage] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('KYC_CONTRACT_ADDRESS')
    if (saved) {
      setContractAddress(saved)
    } else {
      setContractAddress(KYC_CONTRACT_ADDRESS)
    }
  }, [])

  const handleSaveContractAddress = () => {
    if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
      setSaveMessage({
        type: 'error',
        text: 'Invalid contract address format. Must be a valid Ethereum address (0x...)'
      })
      return
    }

    setKYCContractAddress(contractAddress)
    localStorage.setItem('KYC_CONTRACT_ADDRESS', contractAddress)
    setSaveMessage({
      type: 'success',
      text: 'Contract address saved successfully!'
    })

    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleSaveWalletAddress = () => {
    if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
      setSaveMessage({
        type: 'error',
        text: 'Invalid wallet address format.'
      })
      return
    }

    localStorage.setItem('USER_WALLET_ADDRESS', walletAddress)
    setSaveMessage({
      type: 'success',
      text: 'Wallet address saved successfully!'
    })

    setTimeout(() => setSaveMessage(null), 3000)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Settings</h3>
        </div>
        <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-6 space-y-6">
          {/* Your Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Wallet Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSaveWalletAddress}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Current: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>

          {/* KYC Contract Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KYC Contract Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-sm"
              />
              <button
                onClick={handleSaveContractAddress}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Current: {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How to configure:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Deploy your KYCHashStore contract on Polygon Mumbai</li>
                  <li>Copy the contract address and paste it above</li>
                  <li>Update your wallet address if needed</li>
                  <li>Click Save to persist the settings</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {saveMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{saveMessage.text}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ContractSettings
