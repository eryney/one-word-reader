import ePub from 'epubjs';
import { cleanText } from '../textProcessor';

export async function parseEPUB(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);

    await book.ready;

    // Extract metadata
    const metadata = await book.loaded.metadata;

    // NEW: Extract TOC (table of contents)
    let tocSections = [];
    try {
      const navigation = await book.loaded.navigation;
      if (navigation && navigation.toc) {
        tocSections = navigation.toc.map(item => ({
          title: item.label,
          href: item.href,
          level: item.subitems && item.subitems.length > 0 ? 1 : 2
        }));
      }
    } catch (error) {
      console.warn('Could not extract TOC:', error);
    }

    console.log(`Found ${tocSections.length} TOC entries:`, tocSections.map(s => s.title));

    // Extract all text from spine
    const spine = await book.loaded.spine;
    let fullText = '';
    let sectionMarkers = []; // NEW: Track section markers
    let currentCharPosition = 0; // NEW: Track character position

    // Load all sections and extract text
    for (let item of spine.items) {
      try {
        // Check if this spine item corresponds to a TOC entry
        const tocEntry = tocSections.find(t =>
          item.href.includes(t.href) || t.href.includes(item.href) || item.href.endsWith(t.href)
        );

        if (tocEntry) {
          sectionMarkers.push({
            title: tocEntry.title,
            charPosition: currentCharPosition,
            level: tocEntry.level
          });
        }

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

        // If no TOC entry was found, try to extract from heading tags
        if (!tocEntry && doc.body) {
          const headings = doc.body.querySelectorAll('h1, h2, h3');
          headings.forEach(h => {
            const level = parseInt(h.tagName[1]);
            const title = h.textContent.trim();
            if (title && title.length > 2) {
              // Calculate approximate character position for this heading
              const headingText = h.textContent;
              const indexInText = text.indexOf(headingText);
              if (indexInText >= 0) {
                sectionMarkers.push({
                  title: title,
                  charPosition: currentCharPosition + indexInText,
                  level: level
                });
              }
            }
          });
        }

        fullText += text + ' ';
        currentCharPosition += text.length + 1;
      } catch (error) {
        console.warn('Error loading section:', item.href, error);
        // Continue with other sections
      }
    }

    console.log(`Found ${sectionMarkers.length} section markers:`, sectionMarkers.map(s => s.title));

    const cleanedText = cleanText(fullText);
    const wordCount = cleanedText.split(/\s+/).filter(w => w.length > 0).length;

    return {
      title: metadata.title || file.name.replace('.epub', ''),
      author: metadata.creator || 'Unknown',
      text: cleanedText,
      wordCount: wordCount,
      format: 'epub',
      sectionMarkers: sectionMarkers // NEW: Include section markers
    };
  } catch (error) {
    console.error('Error parsing EPUB:', error);
    throw new Error(`Failed to parse EPUB file: ${error.message}`);
  }
}
