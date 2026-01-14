import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Calculate font size
  const fontSize = Math.floor(size / 6.5);

  // Set font for "Flow"
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textBaseline = 'middle';

  // Measure text widths
  const textFl = 'Fl';
  const textO = 'o';
  const textW = 'w';

  const widthFl = ctx.measureText(textFl).width;
  const widthO = ctx.measureText(textO).width;
  const widthW = ctx.measureText(textW).width;

  // Calculate total width and starting position for "Flow"
  const totalWidth = widthFl + widthO + widthW;
  const startX = (size - totalWidth) / 2;
  const yFlow = size * 0.5;

  // Draw "Fl" in white
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText(textFl, startX, yFlow);

  // Draw "o" in red
  ctx.fillStyle = '#EF4444';
  ctx.fillText(textO, startX + widthFl, yFlow);

  // Draw "w" in white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(textW, startX + widthFl + widthO, yFlow);

  return canvas.toBuffer('image/png');
}

// Create icons directory if it doesn't exist
const iconsDir = join(__dirname, 'public', 'icons');
try {
  mkdirSync(iconsDir, { recursive: true });
} catch (err) {
  // Directory already exists
}

// Generate 192x192 icon
console.log('Generating 192x192 icon...');
const icon192 = generateIcon(192);
writeFileSync(join(iconsDir, 'icon-192.png'), icon192);
console.log('✓ Created public/icons/icon-192.png');

// Generate 512x512 icon
console.log('Generating 512x512 icon...');
const icon512 = generateIcon(512);
writeFileSync(join(iconsDir, 'icon-512.png'), icon512);
console.log('✓ Created public/icons/icon-512.png');

console.log('\n✓ Icons generated successfully!');
