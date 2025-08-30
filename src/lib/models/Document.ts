import { ObjectId } from 'mongodb'

export interface Document {
  _id?: ObjectId
  filename: string
  originalName: string
  r2Url: string
  r2Key: string
  uploadDate: Date
  extractionStatus: 'pending' | 'processing' | 'completed' | 'failed'
  extractedText?: string
  metadata?: {
    size: number
    mimeType: string
    pageCount?: number
  }
  error?: string
  createdAt: Date
  updatedAt: Date
}

export type DocumentStatus = Document['extractionStatus']

export interface CreateDocumentInput {
  filename: string
  originalName: string
  r2Url: string
  r2Key: string
  size: number
  mimeType: string
}