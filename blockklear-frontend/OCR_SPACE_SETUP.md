# 🔧 OCR.space API Setup Guide

To enable real OCR functionality in BlockKlear, you need to set up OCR.space API.

## 📋 Prerequisites

OCR.space provides a free tier with 25,000 requests per month, which is perfect for prototyping.

## 🚀 Setup Steps

### 1. Get Your Free OCR.space API Key

1. Go to [OCR.space Free API Key Registration](https://ocr.space/ocrapi/freekey)
2. Fill out the registration form with your email
3. Check your email for the API key
4. Copy the API key for configuration

### 2. API Features

**Free Tier Includes:**
- 25,000 requests per month
- 1 MB file size limit
- 3 PDF page limit
- Multiple language support
- Text overlay coordinates
- Searchable PDF creation (with watermark)

### 3. Configure Environment

1. Open the `.env` file in the `blockklear-frontend` directory
2. Add your API key:
   ```env
   VITE_OCR_SPACE_API_KEY=your_actual_api_key_here
   ```

### 4. Test OCR Functionality

1. Restart the development server: `npm run dev`
2. Upload a document image (ID, passport, driver's license)
3. The system will automatically process the image with OCR.space API
4. View extracted text and parsed document data
5. Use the OCR Test Panel (purple button in bottom-left) to verify API connectivity

## 🔄 Fallback Mode

If no API key is configured, the system automatically uses **mock OCR** with sample data for development and testing.

## 🛡️ Security Notes

- Never commit your API key to version control
- The `.env` file is already in `.gitignore`
- Consider using environment-specific API keys for development/production
- OCR.space API keys can be restricted by domain in your account settings

## 📊 OCR Features

The implemented OCR system can extract:

- **Document Type** (Passport, Driver's License, National ID)
- **Document Number**
- **Full Name**
- **Date of Birth**
- **Expiry Date**
- **Issuing Authority**
- **Raw Text** with confidence scores

## 🧪 Testing

Test with various document types:
- Government-issued IDs
- Passports
- Driver's licenses
- Clear, well-lit images work best

## 🔧 Troubleshooting

**OCR not working?**
- Check if API key is correctly set in `.env`
- Verify API key is valid by testing at [OCR.space](https://ocr.space)
- Check browser console for error messages
- Ensure image is clear and text is readable
- Try different OCR engines (Engine 1 vs Engine 2)

**API quota exceeded?**
- Free tier provides 25,000 requests per month
- Monitor usage in your OCR.space account
- Consider upgrading to PRO plan for higher limits

**Image not processing?**
- Check file size (max 1MB for free tier)
- Supported formats: PNG, JPG, GIF, TIF, BMP, PDF
- Ensure image has readable text

## 💡 Development vs Production

**Development Mode:**
- Uses mock OCR if no API key is provided
- Displays detailed OCR results for debugging
- Shows confidence scores and validation errors
- OCR Test Panel for API connectivity testing

**Production Mode:**
- Requires valid OCR.space API key
- Real-time document processing
- Enhanced security and error handling
- Consider PRO plan for guaranteed uptime
