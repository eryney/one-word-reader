import ePub from 'epubjs';
import { cleanText } from '../textProcessor';

export async function parseEPUB(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);

    await book.ready;

    // Extract metadata
    const metadata = await book.loaded.metadata;

    // Extract all text from spine
    const spine = await book.loaded.spine;
    let fullText = '';

    // Load all sections and extract text
    for (let item of spine.items) {
      try {
        const doc = await book.load(item.href);

        // Extract text from the loaded document
        let text = '';
        if (doc.textContent) {
          text = doc.textContent;
        } else if (doc.body && doc.body.textContent) {
          text = doc.body.textContent;
        } else if (typeof doc === 'string') {
          // If doc is HTML string, create a temporary element to extract text
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = doc;
          text = tempDiv.textContent || tempDiv.innerText;
        }

        fullText += text + ' ';
      } catch (error) {
        console.warn('Error loading section:', item.href, error);
        // Continue with other sections
      }
    }

    const cleanedText = cleanText(fullText);
    const wordCount = cleanedText.split(/\s+/).filter(w => w.length > 0).length;

    return {
      title: metadata.title || file.name.replace('.epub', ''),
      author: metadata.creator || 'Unknown',
      text: cleanedText,
      wordCount: wordCount,
      format: 'epub'
    };
  } catch (error) {
    console.error('Error parsing EPUB:', error);
    throw new Error(`Failed to parse EPUB file: ${error.message}`);
  }
}
