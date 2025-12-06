import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple canvas-free image generation using data URIs
const createPlaceholderDataURI = (width, height, text, bgColor = '#f8f6f3') => {
    // Create SVG
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#8b7355" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;

    // Convert to base64
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
};

// For now, we'll create a simple CSS file with background images as data URIs
// This is better than trying to generate actual PNG files without dependencies

const placeholders = {
    'hero-bg.jpg': { width: 1920, height: 1080, text: 'Plafonds Décoratifs', bg: '#2c2c2c' },
    'intro-placeholder.jpg': { width: 800, height: 600, text: 'Artisan at Work', bg: '#f8f6f3' },
    'about-portrait.jpg': { width: 600, height: 800, text: 'Alexandre CHALIGNÉ', bg: '#f8f6f3' },
    'project-1.jpg': { width: 1200, height: 900, text: 'Hôtel de Luxe - Genève', bg: '#e5e5e5' },
    'project-2.jpg': { width: 800, height: 600, text: 'Appartement Haussmannien', bg: '#e8e6e3' },
    'project-3.jpg': { width: 800, height: 600, text: 'Villa Contemporaine', bg: '#ebe9e6' },
    'project-4.jpg': { width: 800, height: 600, text: 'Château Historique', bg: '#e5e3e0' },
    'og-image.jpg': { width: 1200, height: 630, text: 'Alexandre CHALIGNÉ', bg: '#f8f6f3' }
};

const imagesDir = path.join(__dirname, 'assets', 'images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate proper SVG files
Object.entries(placeholders).forEach(([filename, config]) => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad-${filename}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${config.bg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${adjustColor(config.bg, -10)};stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="${config.width}" height="${config.height}" fill="url(#grad-${filename})"/>
    <text x="50%" y="50%" font-family="Georgia, serif" font-size="32" fill="${config.bg === '#2c2c2c' ? '#c9b299' : '#8b7355'}" text-anchor="middle" dominant-baseline="middle" font-weight="300">${config.text}</text>
</svg>`;

    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, svg);
    console.log(`✓ Created ${filename}`);
});

// Helper function to adjust color brightness
function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

console.log('\n✨ All placeholder images created successfully!');
