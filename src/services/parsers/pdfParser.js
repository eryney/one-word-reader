import * as pdfjsLib from 'pdfjs-dist';
import { cleanText } from '../textProcessor';

// Set up PDF.js worker - use the worker from public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Analyze PDF structure to determine body font size and page zones
async function analyzeDocumentStructure(pdf) {
  const analysis = {
    heights: [],
    yPositions: [],
    pageHeight: 0,
    fontUsage: new Map()
  };

  // Sample first 5 pages
  const pagesToSample = Math.min(5, pdf.numPages);

  for (let i = 1; i <= pagesToSample; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    analysis.pageHeight = viewport.height;

    const textContent = await page.getTextContent();

    for (const item of textContent.items) {
      if (item.str.trim()) {
        analysis.heights.push(item.height);
        analysis.yPositions.push(item.transform[5]);

        const count = analysis.fontUsage.get(item.fontName) || 0;
        analysis.fontUsage.set(item.fontName, count + 1);
      }
    }
  }

  // Calculate body font size (median height in middle Y-range)
  const sortedHeights = analysis.heights.slice().sort((a, b) => a - b);
  const bodyFontHeight = sortedHeights[Math.floor(sortedHeights.length * 0.5)];

  // Define zones
  const headerZone = analysis.pageHeight * 0.9; // Top 10%
  const footerZone = analysis.pageHeight * 0.1; // Bottom 10%

  return {
    bodyFontHeight,
    pageHeight: analysis.pageHeight,
    headerZone,
    footerZone,
    fontUsage: analysis.fontUsage
  };
}

// Classify a text item based on font size and position
function classifyTextItem(item, docStructure) {
  const { bodyFontHeight, headerZone, footerZone, pageHeight } = docStructure;
  const yPos = item.transform[5];
  const height = item.height;
  const text = item.str.trim();

  // Header/Footer detection
  if ((yPos > headerZone || yPos < footerZone) && height <= bodyFontHeight * 0.9) {
    return 'HEADER_FOOTER';
  }

  // Caption detection
  if (height < bodyFontHeight * 0.85) {
    // Check if starts with common caption prefixes
    const captionPrefixes = /^(Figure|Fig\.|Table|Equation|Eq\.|Algorithm|Appendix)/i;
    if (captionPrefixes.test(text)) {
      return 'CAPTION';
    }

    // Small text at bottom = footnote
    if (yPos < pageHeight * 0.2) {
      return 'FOOTNOTE';
    }
  }

  // Title detection (larger font)
  if (height > bodyFontHeight * 1.2) {
    return 'TITLE';
  }

  // Body text (within ±15% of body font)
  if (Math.abs(height - bodyFontHeight) <= bodyFontHeight * 0.15) {
    // In middle 70% of page
    if (yPos > pageHeight * 0.15 && yPos < pageHeight * 0.85) {
      return 'BODY';
    }
  }

  // Default: unknown (keep to be safe)
  return 'UNKNOWN';
}

export async function parsePDF(file) {
  try {
    console.log('Starting PDF parse for:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    console.log('PDF loaded, pages:', pdf.numPages);

    // STEP 1: Analyze document structure
    const docStructure = await analyzeDocumentStructure(pdf);
    console.log('Body font height:', docStructure.bodyFontHeight);

    let fullText = '';
    let stats = {
      total: 0,
      body: 0,
      filtered: 0,
      captions: 0,
      headers: 0
    };

    // STEP 2 & 3: Extract and classify text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      let pageText = '';
      let lastY = null;

      for (let item of textContent.items) {
        if (!item.str.trim()) continue;

        stats.total++;

        // Classify this text item
        const classification = classifyTextItem(item, docStructure);

        // Only include BODY, TITLE, and UNKNOWN text
        if (classification === 'BODY' || classification === 'TITLE' || classification === 'UNKNOWN') {
          // Add line break if on new line
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += '\n';
          }

          pageText += item.str + ' ';
          lastY = item.transform[5];
          stats.body++;
        } else {
          stats.filtered++;
          if (classification === 'CAPTION') stats.captions++;
          if (classification === 'HEADER_FOOTER') stats.headers++;
        }
      }

      fullText += pageText + '\n\n';

      if (i <= 3) {
        console.log(`Page ${i} extracted, length:`, pageText.length);
        console.log(`Page ${i} first 200 chars:`, pageText.substring(0, 200));
      }
    }

    console.log('Extraction stats:', stats);
    console.log(`Filtered out: ${stats.filtered} items (${stats.captions} captions, ${stats.headers} headers/footers)`);
    console.log(`Kept: ${stats.body} body text items`);

    console.log('Total text extracted length:', fullText.length);
    const cleanedText = cleanText(fullText);
    const wordCount = cleanedText.split(/\s+/).filter(w => w.length > 0).length;

    console.log('Cleaned text length:', cleanedText.length, 'Word count:', wordCount);

    // Check if we actually extracted any meaningful text
    if (wordCount === 0 || cleanedText.trim().length === 0) {
      throw new Error(
        'Could not extract text from this PDF.\n\n' +
        'This PDF is likely a scanned image (no text layer).\n\n' +
        'Fix: Convert it at ilovepdf.com/ocr_pdf (free, 1 min)\n' +
        'Then upload the converted PDF here.\n\n' +
        'Or use an EPUB version if available.'
      );
    }

    // Try to extract metadata
    const metadata = await pdf.getMetadata();
    const title = metadata.info?.Title || file.name.replace('.pdf', '');
    const author = metadata.info?.Author || 'Unknown';

    const result = {
      title: title,
      author: author,
      text: cleanedText,
      wordCount: wordCount,
      format: 'pdf'
    };

    console.log('PDF parse complete:', result);
    return result;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF file: ${error.message}`);
  }
}
