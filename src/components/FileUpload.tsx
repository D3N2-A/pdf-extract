"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({
  onFileUpload,
  isUploading,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragOver(false);
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    disabled: isUploading,
  });

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden
          ${
            isDragOver
              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105 shadow-xl"
              : "border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-md hover:bg-white/90 hover:scale-102 shadow-lg hover:shadow-xl"
          }
          ${isUploading ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>

        <input {...getInputProps()} />

        <div className="relative space-y-6">
          <div className="mx-auto relative">
            <div
              className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragOver
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 hover:from-blue-500 hover:to-indigo-600 hover:text-white"
              }`}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-10 h-10"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            {isDragOver && (
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 animate-ping"></div>
            )}
          </div>

          <div>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {isUploading
                ? "Uploading..."
                : isDragOver
                ? "Drop your PDF here!"
                : "Upload a PDF file"}
            </p>
            <p className="text-gray-600">
              Drag and drop your PDF here, or{" "}
              <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                click to browse
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
