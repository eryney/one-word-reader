# Flow

A modern web-based speed reading application using RSVP (Rapid Serial Visual Presentation) technology with Optimal Recognition Point (ORP) highlighting. Flow through your books faster than ever.

## Features

- **RSVP Speed Reading**: Read one word at a time with ORP highlighting (red letter)
- **Traditional Reading Mode**: Standard scrolling reader for comfortable reading
- **Multiple Formats**: Support for EPUB and PDF files
- **Progress Tracking**: Automatically saves your reading position
- **Adjustable Speed**: 150-1000 WPM with easy slider control
- **Keyboard Shortcuts**: Space to play/pause, arrows to skip
- **PWA Support**: Install on your device for offline access
- **Privacy-First**: All books stored locally in your browser

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (usually http://localhost:5173)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Stripe Payment Integration

To add the payment button:

1. Create a Stripe account at https://stripe.com
2. Go to Products → Add Product
3. Create a "$5 Support" product (one-time payment)
4. Generate a Payment Link
5. Copy the link
6. Edit `src/components/Payment/SupportButton.jsx`
7. Replace `YOUR_LINK_HERE` with your actual Stripe Payment Link

## PWA Icon Setup

The app requires icons for PWA installation. Create two PNG icons:

- `public/icons/icon-192.png` (192x192 pixels)
- `public/icons/icon-512.png` (512x512 pixels)

You can use a tool like https://realfavicongenerator.net/ to generate these.

## How to Use

1. **Upload a Book**: Drag and drop or click to upload an EPUB or PDF file
2. **Select a Book**: Click on any book in your library to start reading
3. **Speed Reading Mode**:
   - Click Play to start
   - Adjust speed with the slider
   - Use Space to pause/play
   - Use arrow keys to skip forward/backward
4. **Traditional Mode**: Click "Traditional Mode" button to switch to scrolling reader
5. **Progress**: Your reading position is automatically saved

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- epub.js (EPUB parsing)
- PDF.js (PDF parsing)
- LocalStorage (data persistence)

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

ISC

## Support

If you enjoy using Flow, consider supporting the development!
