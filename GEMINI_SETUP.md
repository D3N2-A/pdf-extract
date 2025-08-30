# Gemini Flash OCR Integration Setup

This project now uses Google's Gemini Flash for advanced OCR processing of PDF documents.

## Prerequisites

1. **Google AI Studio API Key**: Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Environment Setup

1. Copy the environment example file:

   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Gemini API key to `.env.local`:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Make sure all other environment variables are configured:

   ```
   # Cloudflare R2 Storage
   CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
   CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
   CLOUDFLARE_R2_ENDPOINT=your_endpoint_url

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/pdf-extract
   ```

## How It Works

1. **PDF Upload**: PDFs are uploaded and stored in Cloudflare R2
2. **PDF to Images**: Each PDF page is converted to high-resolution PNG images
3. **Gemini Vision OCR**: Each image is processed by Gemini Flash for text extraction
4. **Text Assembly**: Extracted text from all pages is combined with page breaks
5. **Storage**: Final extracted text is stored in MongoDB

## Features

- **High Accuracy**: Gemini Flash provides superior OCR accuracy compared to traditional OCR
- **Multi-language Support**: Supports text extraction in multiple languages
- **Table Recognition**: Better handling of tables and structured content
- **Image Cleanup**: Automatic cleanup of temporary files
- **Error Handling**: Robust error handling with proper cleanup

## API Usage

The extraction API endpoint remains the same:

```bash
POST /api/extract
{
  "documentId": "your_document_id"
}
```

## Performance Notes

- PDF pages are converted to 200 DPI images for optimal OCR quality
- Images are processed in parallel for faster extraction
- Temporary files are automatically cleaned up after processing
- Processing time depends on PDF size and complexity

## Troubleshooting

1. **Invalid API Key**: Ensure your Gemini API key is valid and has sufficient quota
2. **Large PDFs**: Very large PDFs may take longer to process
3. **Memory Issues**: Ensure sufficient system memory for PDF to image conversion
4. **Temporary Files**: Check that the application has write permissions for the temp directory

## Dependencies

New dependencies added for Gemini integration:

- `@google/generative-ai`: Google's official Generative AI SDK
- `pdf2pic`: PDF to image conversion library
