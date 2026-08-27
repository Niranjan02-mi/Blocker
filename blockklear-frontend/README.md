# 🛡 BlockKlear Frontend

**Decentralized KYC Workflow Platform - Frontend Application**

A React-based frontend for the BlockKlear decentralized KYC verification platform. This application provides a user-friendly interface for completing KYC verification and storing verification hashes on the blockchain.

## ✨ Features

- **Wallet Integration**: MetaMask wallet connection with Web3 support
- **Document Upload**: Secure document upload with preview functionality
- **Face Verification**: Webcam-based biometric verification
- **Real-time Progress**: Live progress tracking throughout the KYC process
- **Blockchain Integration**: Store verification hashes on Polygon/Ethereum
- **QR Code Generation**: Downloadable QR codes for verification sharing
- **Responsive Design**: Modern, mobile-friendly interface with TailwindCSS

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd blockklear-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com/
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Network Configuration

The app is configured for Polygon Mumbai testnet by default. To use a different network:

1. Update the network configuration in `src/utils/blockchain.js`
2. Deploy the KYC smart contract to your chosen network
3. Update the contract address in the configuration

## 📱 Usage

### 1. Connect Wallet
- Click "Connect Wallet" in the header
- Approve MetaMask connection
- Ensure you're on Polygon Mumbai testnet

### 2. Start KYC Process
- Navigate to "Start KYC" from the dashboard
- Follow the step-by-step verification process:
  - Upload government-issued ID
  - Complete face verification
  - Submit to blockchain

### 3. View Status
- Check your verification status on the Status page
- Download QR code for verification sharing
- View transaction details on blockchain explorer

## 🏗 Project Structure

```
blockklear-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Header.jsx
│   │   ├── DocumentUpload.jsx
│   │   ├── FaceVerification.jsx
│   │   └── ProgressTracker.jsx
│   ├── contexts/          # React contexts
│   │   └── Web3Context.jsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── KYCFlow.jsx
│   │   └── Status.jsx
│   ├── utils/             # Utility functions
│   │   └── blockchain.js
│   ├── contracts/         # Smart contract files
│   │   └── KYCHashStore.sol
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔐 Smart Contract Integration

The frontend integrates with the `KYCHashStore` smart contract:

```solidity
// Store KYC verification hash
function storeKYC(bytes32 _hash) external

// Check if user has completed KYC
function hasKYC(address _user) external view returns (bool)

// Get KYC hash for user
function getKYCHash(address _user) external view returns (bytes32)
```

## 🎨 Styling

The project uses TailwindCSS for styling with:
- Custom color palette for branding
- Responsive design patterns
- Component-based styling approach
- Dark/light theme support (configurable)

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project follows:
- ESLint configuration for code quality
- Prettier for code formatting
- React best practices
- Modern JavaScript (ES6+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced biometric verification
- [ ] Zero-knowledge proof integration
- [ ] DID (Decentralized Identity) support
- [ ] Enhanced analytics dashboard

---

**Built with ❤️ for the decentralized future**
