# One Word Reader - Project Documentation

## Overview
A no-frills RSVP (Rapid Serial Visual Presentation) speed reader built for reading EPUBs and PDFs. Words flash sequentially at a user-controlled speed, with the Optimal Recognition Point (ORP) highlighted in red and fixed at dead center to eliminate eye movement.

**Live Site**: https://one-word-reader.vercel.app/
**GitHub**: https://github.com/eryney/one-word-reader
**Creator**: Eryney Marrogi ([@eryney_ok](https://x.com/eryney_ok))

## Tech Stack
- **React 19** with Vite 7.3
- **Tailwind CSS 3.4** for styling
- **PDF.js 5.4** for PDF parsing
- **EPUB.js 0.3** for EPUB parsing
- **LocalStorage** for client-side book/progress/bookmark storage
- **Vercel** for hosting with auto-deployment from GitHub main branch
- **Vercel Web Analytics** for page view tracking

## Key Features
1. **RSVP Speed Reading**: Words flash at 100-1000 WPM with adjustable speed
2. **ORP (Optimal Recognition Point)**: Red letter marks focus point, always centered
3. **Dual Reading Modes**: Speed mode (RSVP) and Traditional scrolling mode
4. **Progress Tracking**: Auto-saves reading position every 5 seconds
5. **Bookmarks**: Add notes and jump to saved positions
6. **Section Navigation**: Jump to chapters/sections in academic papers
7. **Dark Mode**: System preference detection with manual toggle
8. **Client-Side Only**: All files stay in browser LocalStorage, nothing uploaded

## Critical Architecture Decisions

### ORP Alignment (MOST FRAGILE PART)
**Location**: `src/utils/orp.jsx`

The ORP letter MUST be fixed at dead center with white letters on both sides. This has been the most problematic aspect of the codebase.

**Working Implementation**:
- Uses absolute positioning with inline color styles (NOT Tailwind classes)
- Before text: `right: '50%', paddingRight: '0.35em', color: '#ffffff'`
- ORP letter: `left: '50%', transform: 'translateX(-50%)', color: '#ef4444'`
- After text: `left: '50%', paddingLeft: '0.35em', color: '#ffffff'`

**DO NOT**:
- Use Tailwind classes for colors (causes CDN cache issues)
- Change padding values without user approval
- Use flexbox or other layout approaches
- Modify this unless explicitly requested

### Section Detection
**Flow**: PDF/EPUB → Parser extracts sections → Map char positions to word indices → UI displays section panel

**Parsers**:
- `src/services/parsers/pdfParser.js`: Detects TITLE items with font size > 120% of body text, matches academic patterns (Abstract, Introduction, Methods, Results, Discussion, Conclusion, References)
- `src/services/parsers/epubParser.js`: Extracts from TOC or falls back to heading tags (h1, h2, h3)

**Mapping**: `src/services/textProcessor.js` → `mapSectionsToWordIndices()` converts character positions to word indices

**Note**: Section detection only works for books uploaded AFTER this feature was implemented. Old books won't have sections.

### LocalStorage Schema
```javascript
// Books metadata
speed_reader_books = [
  {
    id: UUID,
    title: string,
    author: string,
    format: 'pdf' | 'epub',
    wordCount: number,
    dateAdded: ISO string,
    sections: [{title, startIndex, endIndex, level}]
  }
]

// Book text (separate keys)
speed_reader_book_text_{bookId} = "full text content"

// Progress
speed_reader_progress_{bookId} = {
  currentIndex: number,
  scrollPosition: number,
  mode: 'rsvp' | 'traditional',
  wpm: number,
  timestamp: ISO string
}

// Bookmarks
speed_reader_bookmarks = {
  [bookId]: [{
    id: UUID,
    position: number,
    note: string,
    timestamp: ISO string,
    mode: 'rsvp' | 'traditional'
  }]
}

// Stats
speed_reader_stats = {
  [bookId]: [{
    sessionId: UUID,
    startTime: ISO string,
    endTime: ISO string,
    startIndex: number,
    endIndex: number,
    wordsRead: number
  }]
}
```

## Important Files

### Core Components
- `src/App.jsx`: Main app container, routes between library and reader
- `src/components/Library/LibraryView.jsx`: Landing page with book upload and library grid
- `src/components/Reader/ReaderContainer.jsx`: Loads book, manages mode switching
- `src/components/Reader/RSVPReader.jsx`: RSVP speed reading mode
- `src/components/Reader/TraditionalReader.jsx`: Traditional scrolling mode

### Utilities
- `src/utils/orp.jsx`: **CRITICAL** - ORP calculation and highlighting
- `src/services/textProcessor.js`: Word segmentation, section mapping
- `src/services/parsers/pdfParser.js`: PDF text extraction with section detection
- `src/services/parsers/epubParser.js`: EPUB parsing with TOC extraction

### Storage
- `src/services/storage/bookStorage.js`: Book CRUD operations
- `src/services/storage/progressStorage.js`: Reading progress tracking
- `src/services/storage/bookmarkStorage.js`: Bookmark management
- `src/services/storage/statsStorage.js`: Reading session statistics

### Hooks
- `src/hooks/useBooks.js`: Book upload, deletion, integration with parsers
- `src/hooks/useRSVP.js`: RSVP playback logic (play/pause/skip/progress)
- `src/hooks/useProgress.js`: Auto-save reading progress

## Common Issues & Solutions

### Issue: White letters not showing in production
**Root Cause**: Tailwind classes sometimes don't load correctly in Vercel CDN
**Solution**: Use inline color styles instead: `color: '#ffffff'`, `color: '#ef4444'`
**Prevention**: Always use inline styles for critical colors in ORP component

### Issue: Letters overlapping
**Root Cause**: Insufficient padding between ORP letter and surrounding text
**Solution**: Current working value is `0.35em` padding on both sides
**Testing**: Always test spacing at localhost:5174 before pushing to production

### Issue: Section button not appearing
**Root Cause**: Sections only exist for newly uploaded books (not retroactive)
**Solution**: User must re-upload the book after section detection was implemented
**Debug**: Check console logs for "✓ Loaded sections:" or "✗ No sections found"

### Issue: Vercel deployment shows old code
**Root Cause**: CDN caching old JavaScript bundle
**Solution 1**: Hard refresh (Cmd+Shift+R)
**Solution 2**: Force new build with code change (adds new content hash to filename)
**Prevention**: Cache headers are configured in `vercel.json` to prevent this for new users

## Development Workflow

### Local Development
```bash
npm install
npm run dev  # Starts at http://localhost:5173 (or 5174 if 5173 is taken)
```

### Building for Production
```bash
npm run build  # Outputs to dist/
npm run preview  # Preview production build locally
```

### Deployment
- Push to `main` branch → Vercel auto-deploys
- Check deployment status at https://vercel.com/eryney/one-word-reader
- Wait 1-2 minutes for deployment to complete

### Git Workflow
```bash
git add -A
git commit -m "Description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

## Configuration Files

### vercel.json
- Defines build command and output directory
- Sets cache headers (index.html never cached, assets cached forever with content hashing)
- Configures SPA routing (all routes → index.html)

### tailwind.config.js
- Custom font: PT Serif
- Dark mode: 'class' (manual toggle)
- Custom colors: red accent theme

### vite.config.js
- React plugin
- Build output: dist/
- PDF.js worker copied to public/ in postinstall

## Payment Integration
- Stripe payment link: https://buy.stripe.com/dRm6oH1Pk0Cb1oc6glbQY00
- $5 one-time payment
- Button located in top-right corner (yellow gradient)

## Analytics
- Vercel Web Analytics enabled
- View metrics at: Vercel Dashboard → Analytics tab
- Tracks page views, unique visitors, etc.

## Testing Checklist
Before pushing to production:
- [ ] Test ORP alignment at localhost (white letters visible, no overlap, 0.35em spacing)
- [ ] Upload test PDF/EPUB to verify section detection
- [ ] Test speed mode (play/pause, speed adjust, skip forward/back)
- [ ] Test traditional mode (scrolling, progress saving)
- [ ] Test bookmarks (add, delete, jump to)
- [ ] Test mode switching
- [ ] Test dark mode toggle
- [ ] Verify progress auto-saves (wait 5 seconds, refresh, check position)

## Known Limitations
1. Section detection requires re-uploading books (not retroactive)
2. PDF parsing fails on scanned PDFs without text layer (user must OCR first)
3. Very large books (>50MB) may cause browser performance issues
4. LocalStorage has ~5-10MB limit depending on browser
5. No cloud sync - data is per-browser only

## Future Considerations
- Cloud storage option for cross-device sync
- More granular section detection (subsections, numbered sections)
- Better handling of scanned PDFs (integrated OCR)
- Export/import reading data
- Reading statistics dashboard
- Annotation/highlighting support

## Debug Tips
1. Check browser console for errors (F12)
2. Verify LocalStorage keys exist (Application tab → LocalStorage)
3. Check Vercel deployment logs for build errors
4. Test in private browsing to rule out cache issues
5. Compare localhost vs production to isolate deployment issues
6. Use `console.log` statements liberally in parsers/mappers

## Contact
For bugs or questions:
- GitHub Issues: https://github.com/eryney/one-word-reader/issues
- Twitter: https://x.com/eryney_ok
