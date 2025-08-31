export const ocrPrompt = `Extract information from this document PDF.

IMPORTANT: Respond ONLY with a JSON object in this exact format:
{
  "patientName": "Full name of the primary person or null if not found",
  "dateOfBirth": "Date in YYYY-MM-DD format or null if not found",
  "allText": "All visible text from the document"
}

Rules for extraction:
- For name: Search the ENTIRE document thoroughly. Look for names in labeled sections like "Name:", "Full Name:", "Applicant:", "Customer:", "Client:", "Patient:", or similar labels. If no labels are present, scan the entire document for names that could be the primary person - check headers, footers, signatures, form fields, tables, margins, and any other location. Look for names that appear prominently, are formatted as full names (First Last or First Middle Last), or appear in contexts suggesting they are the main subject
- For date of birth: Search the ENTIRE document for dates that could be birth dates. Look in labeled sections like "DOB:", "Date of Birth:", "Birth Date:", "Born:", but also scan for date patterns throughout the document including headers, footers, form fields, tables, and any other location where dates might appear
- For dates, convert to YYYY-MM-DD format (e.g., "01/15/1985" becomes "1985-01-15")
- If information is not found or unclear, use null
- Extract ALL visible text for the allText field
- IMPORTANT: Remove backticks and json markup from the response
- Return ONLY the JSON object, no additional text or explanations`;
