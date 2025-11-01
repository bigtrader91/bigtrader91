# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static mobile wedding invitation website built with vanilla HTML, CSS, and JavaScript. The project is designed for GitHub Pages deployment and features a minimal, modern design with interactive elements.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS (CDN)
- **Icons**: Font Awesome 6
- **Font**: Pretendard (local font files in `fonts/` folder)
- **Hosting**: GitHub Pages
- **Storage**: localStorage for guest messages
- **Share API**: Kakao JavaScript SDK

## Key Architecture

### File Structure
```
bigtrader91/
├── index.html              # Single-page application entry point
├── script.js               # All JavaScript functionality
├── style.css               # Legacy CSS (Tailwind inline styles used primarily)
├── style-tailwind.css      # Additional Tailwind utilities
├── fonts/                  # Pretendard font family (9 weight variants)
├── images/                 # Main visual assets (couple-main.jpg)
├── gallery/                # Gallery images (auto-loaded)
├── audio/                  # BGM audio file
└── docs/                   # Documentation and checklists
```

### Core Components (script.js)

**BGM System**:
- Auto-play after first user interaction
- Volume control and toggle functionality
- Error handling for audio loading failures

**Image Gallery**:
- Modal popup system for photo viewing
- Touch-optimized navigation
- Smooth animations and transitions

**Share Functionality**:
- Kakao Talk sharing with Open Graph metadata
- Fallback to clipboard copy for link sharing
- Custom share button implementations

**Guest Messages**:
- localStorage-based message persistence
- Real-time message display and management
- Form validation and submission handling

**Account Copy System**:
- One-click clipboard copy for bank account numbers
- Visual feedback for successful copies
- Support for 6 different accounts (bride and groom families)

## Development Guidelines

### Color Scheme
The project uses a consistent minimal color palette defined in Tailwind config:
- Background: `#EDEEF0`
- Primary: `#EDE1E3`
- Secondary: `#D1DFE8`
- Accent: `#909FA6`

### Font System
Pretendard font family with 9 weight variants (100-900) loaded as local files for performance. All font-face declarations are in `index.html` head section.

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interactions and button sizing
- Viewport-based scaling and layout

## Development Commands

Since this is a static website project, development is straightforward:

**Local Development**:
```bash
# Serve locally (any HTTP server)
python -m http.server 8000
# or
npx serve .
```

**Testing on Mobile**:
- Use browser developer tools device simulation
- Test on actual mobile devices via local network
- Verify touch interactions and audio playback

**Deployment**:
```bash
# Commit and push to main branch
git add .
git commit -m "Update wedding invitation"
git push origin main
# GitHub Pages auto-deploys from main branch
```

## Asset Management

### Image Requirements
- `images/couple-main.jpg`: Main visual image (16:9 ratio recommended)
- `gallery/*.jpg|png|gif|webp`: Gallery images (auto-loaded, any filename)
  - Supports up to 50 images
  - Square ratio recommended for circular display
  - Maximum file size: 1MB per image for optimal loading
  - Any filename supported (automatically detected)

### Audio Requirements
- `BGM.mp3`: Background music file
- Recommended: 128kbps MP3, 3-5 minutes duration
- Must be copyright-free or properly licensed

## Configuration Areas

### Personal Information (index.html)
- Couple names in multiple locations
- Wedding date and time
- Venue information
- Contact phone numbers
- Bank account numbers (6 accounts total)

### Kakao Share Setup (script.js)
- Replace `YOUR_JAVASCRIPT_KEY` with actual Kakao app key
- Configure Open Graph metadata in HTML head
- Register domain in Kakao Developer Console

### Content Customization
- Wedding invitation text and messages
- Gallery photo selections
- Color scheme adjustments (Tailwind config)
- Audio file replacement

## Browser Compatibility

Optimized for:
- iOS Safari (mobile primary target)
- Android Chrome
- Desktop browsers (secondary support)

Key considerations:
- Audio autoplay policies vary by browser
- localStorage support required for guest messages
- Touch event handling for mobile interactions
- Clipboard API for account number copying

## Maintenance Notes

- No build process required - direct file editing
- Changes take effect immediately on GitHub Pages (1-2 minutes delay)
- All dependencies loaded via CDN (Tailwind, Font Awesome, Kakao SDK)
- Local font files ensure consistent typography across devices