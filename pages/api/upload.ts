import { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import r2Client from "@/lib/r2-client";
import { DocumentService } from "@/lib/database";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadMiddleware = upload.single("file");

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest & { file?: Express.Multer.File },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, uploadMiddleware);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const fileId = uuidv4();
    const fileName = `${fileId}-${file.originalname}`;
    const r2Key = `pdfs/${fileName}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: r2Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await r2Client.send(uploadCommand);

    const r2Url = `${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${r2Key}`;

    const document = await DocumentService.createDocument({
      filename: fileName,
      originalName: file.originalname,
      r2Url,
      r2Key,
      size: file.size,
      mimeType: file.mimetype,
    });

    res.status(200).json({
      success: true,
      document: {
        id: document._id,
        filename: document.filename,
        originalName: document.originalName,
        uploadDate: document.uploadDate,
        extractionStatus: document.extractionStatus,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (
      error instanceof Error &&
      error.message === "Only PDF files are allowed"
    ) {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    res.status(500).json({ error: "Upload failed" });
  }
}
