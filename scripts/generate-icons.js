/**
 * Icon Generator for School Researcher
 * Run: node scripts/generate-icons.js
 * Requires: npm install canvas
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Color palette - teal/coral theme from our app
const colors = {
  primary: '#0d9488',      // Teal
  primaryDark: '#115e59',  // Dark teal
  primaryLight: '#5eead4', // Light teal
  accent: '#f97316',       // Coral/Orange
  background: '#0f172a',   // Dark slate
  white: '#ffffff',
};

/**
 * Draw the main icon design
 */
function drawIcon(ctx, size, isAdaptive = false) {
  const center = size / 2;
  const padding = isAdaptive ? size * 0.15 : size * 0.1;
  const iconSize = size - padding * 2;
  
  // Background
  if (!isAdaptive) {
    // Rounded square background with gradient
    const radius = size * 0.22;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, colors.primaryDark);
    gradient.addColorStop(1, colors.primary);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  // Draw graduation cap
  const capSize = iconSize * 0.45;
  const capY = center - capSize * 0.15;
  
  // Cap base (diamond shape)
  ctx.beginPath();
  ctx.moveTo(center, capY - capSize * 0.3);
  ctx.lineTo(center + capSize * 0.6, capY);
  ctx.lineTo(center, capY + capSize * 0.3);
  ctx.lineTo(center - capSize * 0.6, capY);
  ctx.closePath();
  ctx.fillStyle = colors.white;
  ctx.fill();
  
  // Cap top (rectangle on top)
  const topWidth = capSize * 0.7;
  const topHeight = capSize * 0.15;
  ctx.fillStyle = colors.primaryLight;
  ctx.fillRect(center - topWidth / 2, capY - capSize * 0.35 - topHeight, topWidth, topHeight);
  
  // Button on top
  ctx.beginPath();
  ctx.arc(center, capY - capSize * 0.35 - topHeight / 2, capSize * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = colors.accent;
  ctx.fill();
  
  // Tassel
  ctx.beginPath();
  ctx.moveTo(center, capY - capSize * 0.35 - topHeight / 2);
  ctx.lineTo(center + capSize * 0.35, capY + capSize * 0.15);
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = size * 0.025;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Tassel end
  ctx.beginPath();
  ctx.arc(center + capSize * 0.35, capY + capSize * 0.2, capSize * 0.06, 0, Math.PI * 2);
  ctx.fillStyle = colors.accent;
  ctx.fill();
  
  // Magnifying glass
  const glassSize = capSize * 0.5;
  const glassX = center + capSize * 0.25;
  const glassY = center + capSize * 0.35;
  
  // Glass circle
  ctx.beginPath();
  ctx.arc(glassX, glassY, glassSize * 0.4, 0, Math.PI * 2);
  ctx.strokeStyle = colors.white;
  ctx.lineWidth = size * 0.035;
  ctx.stroke();
  
  // Glass inner
  ctx.beginPath();
  ctx.arc(glassX, glassY, glassSize * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();
  
  // Glass handle
  ctx.beginPath();
  ctx.moveTo(glassX + glassSize * 0.28, glassY + glassSize * 0.28);
  ctx.lineTo(glassX + glassSize * 0.55, glassY + glassSize * 0.55);
  ctx.strokeStyle = colors.white;
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = 'round';
  ctx.stroke();
}

/**
 * Draw splash screen
 */
function drawSplash(ctx, width, height) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors.background);
  gradient.addColorStop(0.5, colors.primaryDark);
  gradient.addColorStop(1, colors.background);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Decorative circles
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, width * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = colors.primary;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.8, width * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = colors.accent;
  ctx.fill();
  ctx.globalAlpha = 1;
  
  // Center icon
  const iconSize = Math.min(width, height) * 0.25;
  const iconX = (width - iconSize) / 2;
  const iconY = height * 0.35;
  
  ctx.save();
  ctx.translate(iconX, iconY);
  
  // Draw icon without background
  const center = iconSize / 2;
  const capSize = iconSize * 0.5;
  const capY = center;
  
  // Cap base
  ctx.beginPath();
  ctx.moveTo(center, capY - capSize * 0.3);
  ctx.lineTo(center + capSize * 0.6, capY);
  ctx.lineTo(center, capY + capSize * 0.3);
  ctx.lineTo(center - capSize * 0.6, capY);
  ctx.closePath();
  ctx.fillStyle = colors.white;
  ctx.fill();
  
  // Cap top
  const topWidth = capSize * 0.7;
  const topHeight = capSize * 0.15;
  ctx.fillStyle = colors.primaryLight;
  ctx.fillRect(center - topWidth / 2, capY - capSize * 0.35 - topHeight, topWidth, topHeight);
  
  // Button
  ctx.beginPath();
  ctx.arc(center, capY - capSize * 0.35 - topHeight / 2, capSize * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = colors.accent;
  ctx.fill();
  
  // Tassel
  ctx.beginPath();
  ctx.moveTo(center, capY - capSize * 0.35 - topHeight / 2);
  ctx.lineTo(center + capSize * 0.35, capY + capSize * 0.15);
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = iconSize * 0.025;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(center + capSize * 0.35, capY + capSize * 0.2, capSize * 0.06, 0, Math.PI * 2);
  ctx.fillStyle = colors.accent;
  ctx.fill();
  
  // Magnifying glass
  const glassSize = capSize * 0.5;
  const glassX = center + capSize * 0.25;
  const glassY = center + capSize * 0.35;
  
  ctx.beginPath();
  ctx.arc(glassX, glassY, glassSize * 0.4, 0, Math.PI * 2);
  ctx.strokeStyle = colors.white;
  ctx.lineWidth = iconSize * 0.035;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(glassX + glassSize * 0.28, glassY + glassSize * 0.28);
  ctx.lineTo(glassX + glassSize * 0.55, glassY + glassSize * 0.55);
  ctx.strokeStyle = colors.white;
  ctx.lineWidth = iconSize * 0.04;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  ctx.restore();
  
  // App name
  ctx.fillStyle = colors.white;
  ctx.font = `bold ${width * 0.065}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('School', width / 2, height * 0.58);
  ctx.fillText('Researcher', width / 2, height * 0.65);
  
  // Tagline
  ctx.fillStyle = colors.primaryLight;
  ctx.font = `${width * 0.032}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText('AI-Powered College Research', width / 2, height * 0.72);
}

/**
 * Generate all icons
 */
function generateIcons() {
  console.log('🎨 Generating icons for School Researcher...\n');
  
  // 1. Main App Icon (1024x1024)
  console.log('📱 Creating icon.png (1024x1024)...');
  const iconCanvas = createCanvas(1024, 1024);
  const iconCtx = iconCanvas.getContext('2d');
  drawIcon(iconCtx, 1024);
  fs.writeFileSync(path.join(ASSETS_DIR, 'icon.png'), iconCanvas.toBuffer('image/png'));
  
  // 2. Adaptive Icon (1024x1024) - Android, no background
  console.log('🤖 Creating adaptive-icon.png (1024x1024)...');
  const adaptiveCanvas = createCanvas(1024, 1024);
  const adaptiveCtx = adaptiveCanvas.getContext('2d');
  // Fill with primary color for adaptive background
  adaptiveCtx.fillStyle = colors.primary;
  adaptiveCtx.fillRect(0, 0, 1024, 1024);
  drawIcon(adaptiveCtx, 1024, true);
  fs.writeFileSync(path.join(ASSETS_DIR, 'adaptive-icon.png'), adaptiveCanvas.toBuffer('image/png'));
  
  // 3. Splash Screen (1242x2436)
  console.log('✨ Creating splash.png (1242x2436)...');
  const splashCanvas = createCanvas(1242, 2436);
  const splashCtx = splashCanvas.getContext('2d');
  drawSplash(splashCtx, 1242, 2436);
  fs.writeFileSync(path.join(ASSETS_DIR, 'splash.png'), splashCanvas.toBuffer('image/png'));
  
  // 4. Favicon (48x48)
  console.log('🌐 Creating favicon.png (48x48)...');
  const faviconCanvas = createCanvas(48, 48);
  const faviconCtx = faviconCanvas.getContext('2d');
  drawIcon(faviconCtx, 48);
  fs.writeFileSync(path.join(ASSETS_DIR, 'favicon.png'), faviconCanvas.toBuffer('image/png'));
  
  console.log('\n✅ All icons generated successfully!');
  console.log(`📁 Location: ${ASSETS_DIR}`);
}

generateIcons();

