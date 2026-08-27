# BlockKlear - Blockchain Configuration Guide

## Your Wallet Information
**Wallet Address:** `0x34c9E1027590614B97473aa7Fa44bEb945dc2053`

## Quick Setup Steps

### 1. Deploy Smart Contract
Deploy the `KYCHashStore.sol` contract to Polygon Mumbai Testnet:

```solidity
// Contract will be available in src/contracts/KYCHashStore.sol
```

**To deploy:**
- Use Remix IDE (https://remix.ethereum.org/)
- Or use Hardhat/Truffle locally
- Network: Polygon Mumbai Testnet
- Chain ID: 80001

### 2. Configure Contract Address
1. Go to Dashboard (http://localhost:5173/)
2. Click on **"Blockchain Settings"** section
3. Paste your deployed contract address (0x...)
4. Click **Save**
5. Your wallet address is pre-filled: `0x34c9E1027590614B97473aa7Fa44bEb945dc2053`

### 3. Network Configuration
The app is pre-configured for **Polygon Mumbai Testnet**:
- **Network Name:** Polygon Mumbai Testnet
- **Chain ID:** 0x13881 (80001)
- **RPC URL:** https://rpc-mumbai.maticvigil.com/
- **Currency:** MATIC

### 4. Get Test MATIC
Visit the Polygon Mumbai Faucet:
- https://faucet.polygon.technology/

Enter your wallet address to receive test MATIC tokens for gas fees.

## Smart Contract Functions

### `storeKYC(bytes32 _hash)`
Stores the KYC verification hash on the blockchain.
- **Input:** Hashed KYC data
- **Gas Limit:** ~300,000 (with buffer)
- **Returns:** Transaction hash for verification

### `getKYCHash(address _user)`
Retrieves the KYC hash for a specific address.

### `verifyKYC(address _user, bytes32 _hash)`
Verifies if a user's KYC hash matches the stored one.

## Blockchain Storage Flow

1. **Document Verification** → OCR extracts document data
2. **Face Verification** → Biometric verification
3. **Data Preparation** → Prepare KYC data for hashing
4. **Hash Generation** → Create SHA-256 hash using CryptoJS
5. **Contract Call** → Store hash on blockchain
6. **Confirmation** → Wait for transaction confirmation
7. **Status Update** → Save transaction details

## Troubleshooting

### Error: "missing revert data"
**Cause:** Contract address is incorrect or contract not deployed
**Fix:** 
1. Verify contract address is correct
2. Ensure contract is deployed to Polygon Mumbai
3. Check contract ABI matches deployed contract

### Error: "Insufficient gas"
**Cause:** Gas limit too low or insufficient MATIC
**Fix:**
1. Request more test MATIC from faucet
2. Check if gas estimation works properly

### Error: "Contract not found"
**Cause:** Wrong network selected
**Fix:**
1. Open MetaMask
2. Switch to Polygon Mumbai Testnet
3. Reload the application

## Testing Checklist

- [ ] Wallet connected to Polygon Mumbai
- [ ] Have test MATIC tokens
- [ ] Smart contract deployed
- [ ] Contract address configured in settings
- [ ] Can upload document
- [ ] Can capture face
- [ ] Blockchain transaction succeeds
- [ ] Transaction visible on PolygonScan

## Important Links

- **PolygonScan Mumbai:** https://mumbai.polygonscan.com/
- **Polygon Faucet:** https://faucet.polygon.technology/
- **Remix IDE:** https://remix.ethereum.org/
- **Contract Docs:** Check `src/contracts/KYCHashStore.sol`

## Features Implemented

✅ Camera access with fallback constraints
✅ Document OCR analysis
✅ Face verification
✅ Blockchain integration
✅ Contract settings UI
✅ Error handling and recovery
✅ Transaction confirmation
✅ Local storage persistence

---

**Last Updated:** January 26, 2026
