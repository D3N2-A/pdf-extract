# PDF Extract

A Next.js application for uploading PDF files and extracting their text content using Cloudflare R2 for storage and MongoDB for document metadata.

## Architecture
<img width="2904" height="2060" alt="Architechture-2025-08-29-2229" src="https://github.com/user-attachments/assets/802cb542-e6d9-4565-9d45-e0212b451b96" />


## Features

- Drag-and-drop PDF file upload
- Upload to Cloudflare R2 storage
- Document metadata storage in MongoDB
- Asynchronous PDF text extraction
- Real-time status polling with scanning animation
- Responsive UI built with Tailwind CSS

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.local.example .env.local
   ```

   Required environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `CLOUDFLARE_R2_ACCESS_KEY_ID`: Cloudflare R2 access key
   - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: Cloudflare R2 secret key
   - `CLOUDFLARE_R2_ENDPOINT`: Your R2 endpoint URL
   - `CLOUDFLARE_R2_BUCKET_NAME`: R2 bucket name

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Upload a PDF file using the drag-and-drop interface
2. The file is uploaded to Cloudflare R2
3. Document metadata is stored in MongoDB
4. The scanning animation shows processing status
5. Text is extracted from the PDF asynchronously
6. View the extracted text once processing is complete

## API Routes

- `POST /api/upload` - Upload PDF to R2 and create document record
- `POST /api/extract` - Start PDF text extraction process
- `GET /api/documents/[id]/status` - Check extraction status

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Storage:** Cloudflare R2 (S3-compatible)
- **Database:** MongoDB
- **PDF Processing:** pdf-parse library
