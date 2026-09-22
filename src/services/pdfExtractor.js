/**
 * PDF Text Extraction Service for MINERD Curricular Documents
 * Decodes compressed /FlateDecode streams using pdfjsLib (CDN/global) with native DecompressionStream fallback.
 */

// Dynamic CDN loader for pdfjsLib if not bundled or in window
let pdfjsPromise = null;
function getPdfJsLib() {
  if (typeof window !== 'undefined' && window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }
  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('No document context'));
    const existing = document.getElementById('pdfjs-script');
    if (existing) {
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
        reject(new Error('pdfjsLib initialization failed'));
      }
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return pdfjsPromise;
}

/**
 * Extrae el texto legible de un archivo PDF descomprimiendo los streams FlateDecode.
 * @param {File|Blob|ArrayBuffer} file Archivo PDF cargado por el usuario
 * @returns {Promise<string>} Texto completo extraído página por página
 */
export async function extractTextFromPDF(file) {
  if (!file) {
    throw new Error('No se proporcionó ningún archivo PDF.');
  }

  try {
    let arrayBuffer;
    if (file instanceof File || file instanceof Blob) {
      arrayBuffer = await file.arrayBuffer();
    } else if (file instanceof ArrayBuffer) {
      arrayBuffer = file;
    } else {
      arrayBuffer = await new Blob([file]).arrayBuffer();
    }

    let fullText = '';

    try {
      const pdfjsLib = await getPdfJsLib();
      if (pdfjsLib && pdfjsLib.getDocument) {
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += `\n--- PÁGINA ${i} ---\n` + pageText;
        }
      }
    } catch (pdfjsErr) {
      console.warn('[pdfExtractor] pdfjsLib fallback notice:', pdfjsErr);
    }

    if (!fullText.trim() || fullText.includes('/FlateDecode')) {
      const nativeText = await fallbackNativeExtract(arrayBuffer);
      if (nativeText) fullText += '\n' + nativeText;
    }

    const cleanText = fullText.replace(/\s+/g, ' ').trim();

    if (!cleanText || cleanText.length < 50) {
      throw new Error('El PDF no contiene texto digital legible (podría ser un documento escaneado como imagen).');
    }

    return cleanText;
  } catch (error) {
    console.error('Error al parsear el PDF:', error);
    throw error;
  }
}

// Alias export for backward compatibility
export const extractTextFromPdf = extractTextFromPDF;

/**
 * Fallback nativo usando DecompressionStream del navegador.
 */
async function fallbackNativeExtract(arrayBuffer) {
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

    return extractedBlocks.join('\n').trim();
  } catch (e) {
    return '';
  }
}

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

function parsePdfTextOperators(uncompressedString) {
  if (!uncompressedString) return '';
  const textTokens = [];
  const tjMatches = uncompressedString.match(/\(([^()]*)\)\s*T[jJ]/g) || [];
  for (const tj of tjMatches) {
    const inner = tj.replace(/^\(/, '').replace(/\)\s*T[jJ]$/, '').trim();
    if (inner.length > 0) textTokens.push(inner);
  }
  const tjArrayMatches = uncompressedString.match(/\[([\s\S]*?)\]\s*TJ/gi) || [];
  for (const tja of tjArrayMatches) {
    const innerStrings = tja.match(/\(([^()]*)\)/g) || [];
    const joined = innerStrings.map(s => s.slice(1, -1)).join('').trim();
    if (joined.length > 0) textTokens.push(joined);
  }
  return textTokens.join(' ');
}

export function sanitizeExtractedText(text) {
  if (!text) return '';
  return text
    .replace(/<<[\s\S]*?>>/g, '')
    .replace(/\/Filter\s*\/FlateDecode/g, '')
    .replace(/\/Length\s*\d+/g, '')
    .replace(/stream[\s\S]*?endstream/gi, '')
    .replace(/endobj|obj|xref|trailer|startxref/gi, '')
    .replace(/[^\x0A\x0D\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}
