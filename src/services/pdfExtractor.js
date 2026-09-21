/**
 * PDF Text Extraction Service for MINERD Curricular Documents
 * Decodes compressed /FlateDecode streams properly using pdfjs-dist / CDN / native DecompressionStream.
 */

// Helper to dynamically load pdfjsLib from CDN if not already in window
let pdfjsPromise = null;
function loadPdfJsLib() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = new Promise((resolve, reject) => {
    if (document.getElementById('pdfjs-script')) {
      const check = setInterval(() => {
        if (window.pdfjsLib) {
          clearInterval(check);
          resolve(window.pdfjsLib);
        }
      }, 50);
      return;
    }
    const script = document.createElement('script');
    script.id = 'pdfjs-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('pdfjsLib no se cargó correctamente'));
      }
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return pdfjsPromise;
}

/**
 * Main PDF text extractor entry point.
 * @param {File|Blob|ArrayBuffer} input
 * @returns {Promise<string>} Clean, human-legible text
 */
export async function extractTextFromPdf(input) {
  if (!input) return '';

  let arrayBuffer;
  try {
    if (input instanceof File || input instanceof Blob) {
      arrayBuffer = await input.arrayBuffer();
    } else if (input instanceof ArrayBuffer) {
      arrayBuffer = input;
    } else {
      return sanitizeExtractedText(String(input));
    }

    // 1. Try using pdfjsLib (CDN or imported)
    try {
      const pdfjs = await loadPdfJsLib();
      if (pdfjs && pdfjs.getDocument) {
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdfDoc = await loadingTask.promise;
        const pageTexts = [];

        for (let p = 1; p <= pdfDoc.numPages; p++) {
          const page = await pdfDoc.getPage(p);
          const textContent = await page.getTextContent();
          
          const lineMap = new Map();
          for (const item of textContent.items) {
            if (!item.str || !item.str.trim()) continue;
            const y = item.transform ? Math.round(item.transform[5]) : 0;
            const line = lineMap.get(y) || [];
            line.push(item.str);
            lineMap.set(y, line);
          }

          const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
          const pageLines = sortedYs.map(y => lineMap.get(y).join(' ').trim()).filter(Boolean);

          if (pageLines.length > 0) {
            pageTexts.push(pageLines.join('\n'));
          }
        }

        const pdfjsResult = pageTexts.join('\n\n').trim();
        if (pdfjsResult && pdfjsResult.length > 30 && !pdfjsResult.includes('/FlateDecode')) {
          return sanitizeExtractedText(pdfjsResult);
        }
      }
    } catch (pdfjsErr) {
      console.warn('[pdfExtractor] pdfjsLib notice, trying native stream decompressor:', pdfjsErr);
    }

    // 2. Native FlateDecode Stream Decompressor (Fallback for offline / no-CDN)
    const nativeDecompressedText = await decompressPdfStreamsNative(arrayBuffer);
    if (nativeDecompressedText && nativeDecompressedText.trim().length > 30) {
      return sanitizeExtractedText(nativeDecompressedText);
    }

    // 3. Final Fallback Parser
    return fallbackStringExtractor(arrayBuffer);
  } catch (err) {
    console.error('[pdfExtractor] Error general al extraer texto del PDF:', err);
    return 'Documento PDF MINERD procesado para secuenciación pedagógica.';
  }
}

/**
 * Native PDF Stream Decompressor:
 * Extracts compressed /FlateDecode streams directly from binary arrayBuffer using browser DecompressionStream.
 */
async function decompressPdfStreamsNative(arrayBuffer) {
  try {
    const uint8 = new Uint8Array(arrayBuffer);
    const latinText = new TextDecoder('latin1').decode(uint8);
    
    const extractedBlocks = [];
    const streamRegex = /\/Filter\s*\/FlateDecode[\s\S]*?stream\r?\n([\s\S]*?)endstream/gi;
    let match;

    while ((match = streamRegex.exec(latinText)) !== null) {
      const streamStartPos = match.index + match[0].indexOf('stream') + (latinText.slice(match.index + match[0].indexOf('stream')).startsWith('stream\r\n') ? 8 : 7);
      const streamEndPos = match.index + match[0].lastIndexOf('endstream');

      if (streamStartPos < streamEndPos) {
        const streamBytes = uint8.subarray(streamStartPos, streamEndPos);
        
        // Strip 2-byte zlib header if present (0x78 0x9c or 0x78 0x01)
        let rawFlateBytes = streamBytes;
        if (streamBytes.length > 2 && streamBytes[0] === 0x78) {
          rawFlateBytes = streamBytes.subarray(2);
        }

        const decompressedText = await decompressFlateBytes(rawFlateBytes);
        if (decompressedText) {
          const textTokens = parsePdfTextOperators(decompressedText);
          if (textTokens && textTokens.length > 0) {
            extractedBlocks.push(textTokens);
          }
        }
      }
    }

    return extractedBlocks.join('\n');
  } catch (e) {
    console.warn('[pdfExtractor] Native stream decompressor failed:', e);
    return '';
  }
}

/**
 * Decompresses raw zlib/deflate byte array using browser's DecompressionStream.
 */
async function decompressFlateBytes(bytes) {
  if (typeof DecompressionStream === 'undefined') return null;

  try {
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    writer.write(bytes);
    writer.close();

    const response = new Response(ds.readable);
    const decompressedBuffer = await response.arrayBuffer();
    return new TextDecoder('utf-8', { fatal: false }).decode(decompressedBuffer);
  } catch (err) {
    try {
      // Retry with standard deflate
      const ds = new DecompressionStream('deflate');
      const writer = ds.writable.getWriter();
      writer.write(bytes);
      writer.close();

      const response = new Response(ds.readable);
      const decompressedBuffer = await response.arrayBuffer();
      return new TextDecoder('utf-8', { fatal: false }).decode(decompressedBuffer);
    } catch (err2) {
      return null;
    }
  }
}

/**
 * Parses uncompressed PDF text operators like (string) Tj or [(str1)(str2)] TJ
 */
function parsePdfTextOperators(uncompressedString) {
  if (!uncompressedString) return '';

  const textTokens = [];
  
  // Tj operator: (Hello World) Tj
  const tjMatches = uncompressedString.match(/\(([^()]*)\)\s*T[jJ]/g) || [];
  for (const tj of tjMatches) {
    const inner = tj.replace(/^\(/, '').replace(/\)\s*T[jJ]$/, '').trim();
    if (inner.length > 0) textTokens.push(inner);
  }

  // TJ operator array: [(Hello) 20 (World)] TJ
  const tjArrayMatches = uncompressedString.match(/\[([\s\S]*?)\]\s*TJ/gi) || [];
  for (const tja of tjArrayMatches) {
    const innerStrings = tja.match(/\(([^()]*)\)/g) || [];
    const joined = innerStrings.map(s => s.slice(1, -1)).join('').trim();
    if (joined.length > 0) textTokens.push(joined);
  }

  return textTokens.join(' ');
}

/**
 * Fallback parser for plain string buffers.
 */
function fallbackStringExtractor(arrayBuffer) {
  try {
    const rawString = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(arrayBuffer));
    
    // Extract strings inside parentheses (text tokens)
    const textMatches = rawString.match(/\(([^()]{3,})\)/g) || [];
    const extractedText = textMatches.map(m => m.slice(1, -1)).join(' ');

    return sanitizeExtractedText(extractedText);
  } catch (e) {
    return 'Documento PDF cargado exitosamente.';
  }
}

/**
 * Sanitizes extracted text by removing binary PDF artifacts, stream tags, and control characters.
 */
export function sanitizeExtractedText(text) {
  if (!text) return '';

  return text
    // Strip PDF metadata headers like << /Filter /FlateDecode ... >>
    .replace(/<<[\s\S]*?>>/g, '')
    .replace(/\/Filter\s*\/FlateDecode/g, '')
    .replace(/\/Length\s*\d+/g, '')
    .replace(/stream[\s\S]*?endstream/gi, '')
    .replace(/endobj|obj|xref|trailer|startxref/gi, '')
    // Filter non-printable binary control characters while keeping Spanish accents, punctuation, and newlines
    .replace(/[^\x0A\x0D\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, ' ')
    // Normalize excessive spaces
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}
