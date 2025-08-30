import {
  GenerativeModel,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";

import { ocrPrompt } from "@/app/constants/ocr";

interface PatientData {
  name: string | null;
  dateOfBirth: string | null;
}

interface GeminiOCRResult {
  success: boolean;
  extractedText: string;
  patientData?: PatientData;
  error?: string;
}

class GeminiOCRService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async extractTextFromPDF(pdfBuffer: Buffer): Promise<GeminiOCRResult> {
    try {
      const pdfBase64 = pdfBuffer.toString("base64");

      const result = await this.model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: ocrPrompt },
              {
                inlineData: {
                  data: pdfBase64,
                  mimeType: "application/pdf",
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              patientName: { type: SchemaType.STRING },
              dateOfBirth: { type: SchemaType.STRING },
              allText: { type: SchemaType.STRING },
            },
            required: ["patientName", "dateOfBirth", "allText"],
          },
        },
      });

      const response = await result.response;
      const text = response.text();

      try {
        const parsedResponse = JSON.parse(text.trim());
        return {
          success: true,
          extractedText: parsedResponse.allText || text.trim(),
          patientData: {
            name: parsedResponse.patientName,
            dateOfBirth: parsedResponse.dateOfBirth,
          },
        };
      } catch (parseError) {
        console.warn("Failed to parse JSON response, using raw text");
        return {
          success: true,
          extractedText: text.trim(),
          patientData: {
            name: null,
            dateOfBirth: null,
          },
        };
      }
    } catch (error) {
      console.error("Gemini OCR error:", error);
      return {
        success: false,
        extractedText: "",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

const geminiOCRService = new GeminiOCRService();
export default geminiOCRService;
