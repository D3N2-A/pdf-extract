import { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/lib/r2-client";
import { DocumentService } from "@/lib/database";
import geminiOCR from "@/lib/gemini-ocr";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { documentId } = req.body;

  if (!documentId) {
    return res.status(400).json({ error: "Document ID is required" });
  }

  try {
    const document = await DocumentService.getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (document.extractionStatus === "completed") {
      return res.status(200).json({
        success: true,
        message: "Document already extracted",
        extractedText: document.extractedText,
        patientData: document.patientData || { name: null, dateOfBirth: null },
      });
    }

    await DocumentService.updateDocumentStatus(documentId, "processing");

    const getCommand = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: document.r2Key,
    });

    const response = await r2Client.send(getCommand);
    const pdfBuffer = await streamToBuffer(response.Body as any);

    const ocrResult = await geminiOCR.extractTextFromPDF(pdfBuffer);

    if (!ocrResult.success) {
      throw new Error(`OCR failed: ${ocrResult.error}`);
    }

    const extractedText = ocrResult.extractedText;

    await DocumentService.updateDocumentStatus(
      documentId,
      "completed",
      extractedText,
      undefined,
      ocrResult.patientData
    );

    res.status(200).json({
      success: true,
      extractedText,
      patientData: ocrResult.patientData || { name: null, dateOfBirth: null },
    });
  } catch (error) {
    console.error("Extraction error:", error);

    await DocumentService.updateDocumentStatus(
      req.body.documentId,
      "failed",
      undefined,
      error instanceof Error ? error.message : "Unknown error"
    );

    res.status(500).json({ error: "Extraction failed" });
  }
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: any[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
