/**
 * docExtractorService.js
 * In-memory dynamic text extraction for PDF, DOCX, and TXT files.
 */

export const extractTextFromDocument = async (file) => {
  if (!file) throw new Error("No file provided.");

  const extension = file.name.split('.').pop().toLowerCase();

  switch (extension) {
    case 'txt':
      return await extractFromTxt(file);
    case 'docx':
      return await extractFromDocx(file);
    case 'pdf':
      return await extractFromPdf(file);
    default:
      return await extractFromTxt(file);
  }
};

const extractFromTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};

const extractFromDocx = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Use dynamic import if mammoth is available, or fallback to XML text parsing
    const mammoth = await import('mammoth').catch(() => null);
    if (mammoth && mammoth.extractRawText) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || '';
    }

    // Fallback: extract printable ASCII/UTF-8 string sequences from arrayBuffer
    const textDecoder = new TextDecoder('utf-8');
    const rawString = textDecoder.decode(arrayBuffer);
    const cleanText = rawString
      .replace(/<[^>]+>/g, ' ')
      .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return cleanText;
  } catch (error) {
    console.warn("Docx extraction fallback triggered:", error);
    return await extractFromTxt(file);
  }
};

const extractFromPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist').catch(() => null);

    if (pdfjsLib && pdfjsLib.getDocument) {
      // Set worker if needed or disable worker in browser context
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `\n--- página ${i} ---\n` + pageText;
      }

      return fullText.trim();
    }

    // Fallback: extract readable text fragments from raw PDF buffer stream
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const raw = textDecoder.decode(arrayBuffer);
    const matches = raw.match(/\(([^()]{3,})\)/g);
    if (matches && matches.length > 0) {
      return matches.map(m => m.slice(1, -1)).join(' ');
    }

    return raw.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:()-]/g, ' ').replace(/\s+/g, ' ');
  } catch (error) {
    console.warn("PDF extraction fallback triggered:", error);
    return await extractFromTxt(file);
  }
};
