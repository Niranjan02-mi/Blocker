# 🚀 BlockKlear - Setup Instructions for Your Wallet

## Your Wallet Details
- **Wallet Address:** `0x34c9E1027590614B97473aa7Fa44bEb945dc2053`
- **Network:** Polygon Mumbai Testnet
- **Application URL:** http://localhost:5173/

---

## Step 1: Prepare Your Smart Contract

### Option A: Deploy Using Remix IDE (Easiest)
1. Go to https://remix.ethereum.org/
2. Create a new file: `KYCHashStore.sol`
3. Copy the contract code from: `src/contracts/KYCHashStore.sol`
4. Click "Compile"
5. Go to "Deploy & Run Transactions"
6. Select "Injected Provider - MetaMask" in the environment
7. Click "Deploy"
8. **Copy the deployed contract address** (starting with 0x)

### Contract Code Location
```
blockklear-frontend/src/contracts/KYCHashStore.sol
```

---

## Step 2: Configure Your Contract Address

### In the Application:
1. Open http://localhost:5173/
2. Click on Dashboard (top navigation)
3. Scroll down to **"Blockchain Settings"** section
4. Paste your deployed contract address in the **"KYC Contract Address"** field
5. Click **"Save"**

The wallet address is **pre-configured** to:
```
0x34c9E1027590614B97473aa7Fa44bEb945dc2053
```

---

## Step 3: Get Test MATIC Tokens

### Request from Polygon Faucet:
1. Visit: https://faucet.polygon.technology/
2. Enter your wallet address: `0x34c9E1027590614B97473aa7Fa44bEb945dc2053`
3. Select "MATIC Token"
4. Click "Submit"
5. Wait for confirmation (usually 1-2 minutes)

### Verify Receipt:
- Open MetaMask
- Make sure you're on "Polygon Mumbai Testnet"
- Check your balance for MATIC

---

## Step 4: Verify Network Configuration

### In MetaMask:
1. Click the network dropdown (top left)
2. Select **"Polygon Mumbai Testnet"**
3. If not available, add it manually:
   - **Network Name:** Polygon Mumbai Testnet
   - **New RPC URL:** https://rpc-mumbai.maticvigil.com/
   - **Chain ID:** 80001
   - **Currency Symbol:** MATIC
   - **Block Explorer:** https://mumbai.polygonscan.com/

---

## Step 5: Complete KYC Flow

### Process Overview:
```
1. Document Upload
   └─ Upload ID document (JPEG, PNG, or PDF)
   └─ OCR processes document
   └─ Extracts: name, document number, expiry, etc.

2. Face Verification
   └─ Capture your face via camera
   └─ Biometric verification

3. Blockchain Submission
   └─ Generate SHA-256 hash of KYC data
   └─ Submit hash to smart contract
   └─ Receive transaction receipt
   └─ View on PolygonScan
```

### In the App:
1. Click "Start KYC" button
2. Upload your ID document
3. Wait for OCR processing
4. Complete face verification
5. Review your information
6. Click "Submit to Blockchain"
7. Confirm transaction in MetaMask
8. Wait for confirmation
9. View your transaction details

---

## Step 6: Verify Your Transaction

### After successful submission:
1. You'll see a transaction hash
2. Click the **"View on PolygonScan"** link
3. Verify your transaction on the blockchain:
   - **URL Format:** `https://mumbai.polygonscan.com/tx/{TRANSACTION_HASH}`

---

## Troubleshooting

### ❌ Error: "Cannot read properties of undefined"
**Cause:** Contract address not configured or invalid
**Fix:**
1. Go to Dashboard → Blockchain Settings
2. Paste your deployed contract address
3. Click Save
4. Refresh the page

### ❌ Error: "Insufficient funds"
**Cause:** No MATIC tokens in wallet
**Fix:**
1. Request more test MATIC from: https://faucet.polygon.technology/
2. Wait 1-2 minutes for tokens to arrive
3. Check MetaMask balance

### ❌ Error: "Wrong network"
**Cause:** Not connected to Polygon Mumbai
**Fix:**
1. Open MetaMask
2. Switch to "Polygon Mumbai Testnet"
3. Refresh the application

### ❌ Camera not working
**Cause:** Camera permission denied or browser issue
**Fix:**
1. Check browser camera permissions
2. Click "Try Again" in the app
3. Or click "Refresh Page" to retry
4. Try a different browser if needed

### ❌ Document upload fails
**Cause:** File too large or wrong format
**Fix:**
1. Use JPEG, PNG, or PDF format
2. File size must be less than 10MB
3. Ensure document is clear and readable

---

## File Locations

### Smart Contract
```
src/contracts/KYCHashStore.sol
```

### Configuration Files
```
src/utils/blockchain.js          (Blockchain logic)
src/components/ContractSettings.jsx  (Settings UI)
```

### Key Pages
```
src/pages/Dashboard.jsx           (Main dashboard)
src/pages/KYCFlow.jsx            (KYC workflow)
src/pages/Status.jsx             (Status page)
```

---

## Important Links

| Link | Purpose |
|------|---------|
| https://remix.ethereum.org/ | Deploy smart contract |
| https://faucet.polygon.technology/ | Get test MATIC |
| https://mumbai.polygonscan.com/ | View blockchain transactions |
| http://localhost:5173/ | Your application |

---

## Gas Fee Estimation

**Estimated costs for `storeKYC` function:**
- **Gas Limit:** 300,000
- **Gas Price (Mumbai):** ~1 Gwei
- **Estimated Cost:** ~0.0003 MATIC (very cheap!)

---

## Support & Next Steps

### If everything is working:
✅ You can now:
- Upload your ID document
- Complete face verification
- Store your verification hash on blockchain
- View your transaction on PolygonScan

### For production deployment:
- Update RPC URL to production network
- Deploy contract on mainnet
- Implement proper key management
- Add additional security measures

---

**Your Setup:** 
- Wallet: `0x34c9E1027590614B97473aa7Fa44bEb945dc2053`
- Application: Ready to use
- Status: Waiting for contract deployment

Good luck! 🎉
