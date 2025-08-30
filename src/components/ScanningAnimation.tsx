"use client";

interface ScanningAnimationProps {
  fileName: string;
  status: "pending" | "processing" | "completed" | "failed";
}

export default function ScanningAnimation({
  fileName,
  status,
}: ScanningAnimationProps) {
  const getStatusMessage = () => {
    switch (status) {
      case "pending":
        return "Preparing to process...";
      case "processing":
        return "Extracting text from PDF...";
      case "completed":
        return "Extraction completed!";
      case "failed":
        return "Extraction failed";
      default:
        return "Processing...";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden animate-scale-in">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>

        <div className="relative text-center">
          {/* File Icon */}
          <div className="mx-auto w-20 h-20 mb-6 relative">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                status === "completed"
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : status === "failed"
                  ? "bg-gradient-to-br from-red-500 to-pink-600"
                  : "bg-gradient-to-br from-blue-500 to-purple-600"
              }`}
            >
              <svg
                className="w-10 h-10 text-white"
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

            {/* Animated rings for processing */}
            {(status === "pending" || status === "processing") && (
              <>
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/50 animate-ping"></div>
                <div
                  className="absolute inset-1 rounded-2xl border-2 border-purple-400/50 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-2 rounded-xl border border-blue-300/30 animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </>
            )}
          </div>

          {/* File Name */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3 truncate">
            {fileName}
          </h3>

          {/* Status Message */}
          <p className={`text-lg font-medium mb-6 ${getStatusColor()}`}>
            {getStatusMessage()}
          </p>

          {/* Progress Animation */}
          {(status === "pending" || status === "processing") && (
            <div className="space-y-6">
              {/* Scanning Line Animation */}
              <div className="relative">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden relative">
                  {/* Progress Bar */}
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: status === "processing" ? "75%" : "25%" }}
                  ></div>
                  {/* Scanning Light Effect */}
                  <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full animate-scan opacity-80"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Processing...</span>
                  <span>{status === "processing" ? "75%" : "25%"}</span>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="flex flex-col items-center space-y-2 text-green-600 transition-all duration-500">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 relative">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div className="absolute inset-0 rounded-full border border-green-300 animate-ping opacity-30"></div>
                  </div>
                  <span className="font-medium">Upload</span>
                </div>
                <div
                  className={`flex flex-col items-center space-y-2 transition-all duration-500 ${
                    status === "processing"
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center relative transition-all duration-500 ${
                      status === "processing" ? "bg-purple-100" : "bg-gray-100"
                    }`}
                  >
                    {status === "processing" ? (
                      <>
                        <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 rounded-full border border-purple-300 animate-ping opacity-30"></div>
                      </>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    )}
                  </div>
                  <span
                    className={status === "processing" ? "font-medium" : ""}
                  >
                    Extract
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-2 text-gray-400 transition-all duration-500">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Icon */}
          {status === "completed" && (
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center animate-bounce relative shadow-glow-green">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="absolute inset-0 rounded-2xl border-2 border-green-300 animate-ping opacity-50"></div>
              </div>
            </div>
          )}

          {/* Error Icon */}
          {status === "failed" && (
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center animate-pulse relative">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <div className="absolute inset-0 rounded-2xl border-2 border-red-300 animate-ping opacity-50"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
