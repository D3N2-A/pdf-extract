export const ocrPrompt = `Extract patient information from this medical document PDF.

IMPORTANT: Respond ONLY with a JSON object in this exact format:
{
  "patientName": "Full patient name or null if not found",
  "dateOfBirth": "Date in YYYY-MM-DD format or null if not found",
  "allText": "All visible text from the document"
}

Rules for extraction:
- Look for patient name in sections like "Patient Name:", "Name:", "Patient:", or similar labels
- Look for date of birth in sections like "DOB:", "Date of Birth:", "Birth Date:", "Born:", or similar labels
- For dates, convert to YYYY-MM-DD format (e.g., "01/15/1985" becomes "1985-01-15")
- If information is not found or unclear, use null
- Extract ALL visible text for the allText field
- IMPORTANT: Remove backticks and json markup from the response
- Return ONLY the JSON object, no additional text or explanations`;
