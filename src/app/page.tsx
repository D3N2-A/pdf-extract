"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import ScanningAnimation from "@/components/ScanningAnimation";

interface Document {
  id: string;
  filename: string;
  extractionStatus: "pending" | "processing" | "completed" | "failed";
  extractedText?: string;
  patientData?: {
    name: string;
    dateOfBirth: string;
  };
  error?: string;
  updatedAt: string;
}

export default function HomePage() {
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [patientData, setPatientData] = useState<{
    name: string;
    dateOfBirth: string;
  }>({
    name: "",
    dateOfBirth: "",
  });

  const pollStatus = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/status`);
      const data = await response.json();

      if (response.ok) {
        setCurrentDocument(data);

        if (data.extractionStatus === "completed") {
          setExtractedText(data.extractedText || "");
          setPatientData(data.patientData || { name: "", dateOfBirth: "" });
          setIsPolling(false);
        } else if (data.extractionStatus === "failed") {
          setIsPolling(false);
        }
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPolling && currentDocument?.id) {
      interval = setInterval(() => {
        pollStatus(currentDocument.id);
      }, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPolling, currentDocument?.id]);

  const handleFileUpload = async (file: File) => {
    setUploadingFile(file);
    setCurrentDocument(null);
    setExtractedText("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentDocument(data.document);
        setUploadingFile(null);

        await startExtraction(data.document.id);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadingFile(null);
      alert("Upload failed. Please try again.");
    }
  };

  const startExtraction = async (documentId: string) => {
    try {
      setIsPolling(true);

      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Extraction failed");
      }
    } catch (error) {
      console.error("Extraction error:", error);
      setIsPolling(false);
    }
  };

  const handleReset = () => {
    setUploadingFile(null);
    setCurrentDocument(null);
    setIsPolling(false);
    setExtractedText("");
    setPatientData({ name: "", dateOfBirth: "" });
  };

  return (
    <div className="space-y-12">
      {!uploadingFile && !currentDocument && (
        <div className="max-w-2xl mx-auto">
          <FileUpload onFileUpload={handleFileUpload} isUploading={false} />
        </div>
      )}

      {uploadingFile && (
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 animate-ping"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Uploading File
              </h3>
              <p className="text-gray-600 mb-4">{uploadingFile.name}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentDocument && (
        <div className="space-y-6">
          <ScanningAnimation
            fileName={currentDocument.filename}
            status={currentDocument.extractionStatus}
          />

          {currentDocument.extractionStatus === "completed" && (
            <div className="space-y-8">
              {/* Patient Data Section */}
              {patientData && (patientData.name || patientData.dateOfBirth) && (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Patient Information
                    </h3>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {patientData.name && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Patient Name
                          </label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                            <p className="text-gray-900 font-medium">
                              {patientData.name}
                            </p>
                          </div>
                        </div>
                      )}
                      {patientData.dateOfBirth && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                            <p className="text-gray-900 font-medium">
                              {patientData.dateOfBirth}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted Text Section */}
              {extractedText && (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Extracted Text
                    </h3>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 max-h-96 overflow-y-auto border border-gray-200">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                      {extractedText}
                    </pre>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(extractedText)
                      }
                      className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      📋 Copy Text
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      ✨ Upload Another PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentDocument.extractionStatus === "failed" && (
            <div className="max-w-md mx-auto">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Extraction Failed
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {currentDocument.error ||
                      "An error occurred while processing your PDF"}
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    🔄 Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
