import { NextApiRequest, NextApiResponse } from "next";
import { DocumentService } from "@/lib/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Document ID is required" });
  }

  try {
    const document = await DocumentService.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      id: document._id,
      filename: document.originalName,
      extractionStatus: document.extractionStatus,
      extractedText: document.extractedText,
      patientData: document.patientData,
      error: document.error,
      updatedAt: document.updatedAt,
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: "Failed to check status" });
  }
}
