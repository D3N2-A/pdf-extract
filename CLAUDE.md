# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A Next.js application for PDF extraction with the following workflow:
1. Upload PDF files through a web interface
2. Store PDF files in Cloudflare R2 bucket
3. Save document metadata to MongoDB
4. Extract text/data from PDFs asynchronously
5. Poll backend to check extraction status with scanning animation

## Architecture
- **Frontend**: Next.js with file upload component and polling mechanism
- **Backend**: Next.js API routes for file upload, database operations, and status checking
- **Storage**: Cloudflare R2 for PDF file storage
- **Database**: MongoDB for document metadata and extraction results
- **PDF Processing**: Server-side PDF extraction (likely using pdf-parse or similar)

## Development Setup
```bash
# Install dependencies
npm install

# Set up environment variables in .env.local:
# MONGODB_URI=your_mongodb_connection_string
# CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key
# CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
# CLOUDFLARE_R2_ENDPOINT=your_r2_endpoint_url
# CLOUDFLARE_R2_BUCKET_NAME=your_r2_bucket_name

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Required Dependencies
- Next.js (with MongoDB template)
- AWS SDK v3 (for Cloudflare R2 S3-compatible API)
- MongoDB driver/Mongoose
- PDF processing library (pdf-parse, pdf2pic, etc.)
- File upload handling (multer or similar)

## Key Components
- File upload component with drag-and-drop
- Progress/scanning animation during processing
- Polling mechanism to check extraction status
- Document list/results display

## API Routes Structure
- `/api/upload` - Handle PDF upload to Cloudflare R2
- `/api/documents` - CRUD operations for document metadata
- `/api/extract` - Trigger PDF extraction process
- `/api/status/[id]` - Check extraction status for polling

## Database Schema
Documents collection should include:
- filename, r2Url, uploadDate, extractionStatus, extractedText, metadata