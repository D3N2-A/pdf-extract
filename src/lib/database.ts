import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from './mongodb'
import { Document, CreateDocumentInput, DocumentStatus } from './models/Document'

export class DocumentService {
  private static async getCollection(): Promise<Collection<Document>> {
    const db = await getDatabase()
    return db.collection<Document>('documents')
  }

  static async createDocument(input: CreateDocumentInput): Promise<Document> {
    const collection = await this.getCollection()
    
    const document: Omit<Document, '_id'> = {
      ...input,
      uploadDate: new Date(),
      extractionStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        size: input.size,
        mimeType: input.mimeType,
      }
    }

    const result = await collection.insertOne(document as Document)
    return { ...document, _id: result.insertedId } as Document
  }

  static async getDocumentById(id: string): Promise<Document | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  static async updateDocumentStatus(
    id: string, 
    status: DocumentStatus, 
    extractedText?: string,
    error?: string
  ): Promise<void> {
    const collection = await this.getCollection()
    
    const updateData: any = {
      extractionStatus: status,
      updatedAt: new Date()
    }
    
    if (extractedText) {
      updateData.extractedText = extractedText
    }
    
    if (error) {
      updateData.error = error
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
  }

  static async getAllDocuments(): Promise<Document[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  static async deleteDocument(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}