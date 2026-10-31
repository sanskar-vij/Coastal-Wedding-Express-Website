# Aarav & Meera · Coastal Wedding Express

> **A luxury, cinematic, mobile-first digital wedding invitation web experience.**  
> *Eight stops, one beautiful lifetime together.*

[![Astro](https://img.shields.io/badge/Astro-7.4-FF5D01.svg?logo=astro&logoColor=white)](https://astro.build)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.22-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]
[![License](https://img.shields.io/badge/License-MIT-gold.svg)]()

---

## Overview

**Coastal Wedding Express** is an interactive, multi-sensory wedding invitation website designed with a nostalgic coastal vintage railway aesthetic. Styled after a royal luxury train journey traversing India’s scenic west coast from Mumbai down to Goa, the invitation guides guests through eight curated "stops" capturing Aarav and Meera's love story, wedding ceremonies, travel details, and accommodation.

Built with **Astro**, modern CSS, and high-performance vanilla JavaScript, the website is engineered mobile-first while delivering an ambient, luxury framed showcase on laptops, desktops, and tablets.

---

## Key Interactive Features

### 1. Grand Entrance Pavilion & Audio Autoplay Compliance
- **Interactive Station Gate**: Displays a royal invitation seal and a prominent **"BEGIN YOUR JOURNEY ⟶"** action.
- **Autoplay Security Compliance**: Starting music directly within the user's initial tap gesture satisfies browser autoplay restrictions across Safari, Chrome, Edge, and Firefox.
- **Celebration Soundtrack**: Plays `assets/wedding-song.mp3` with persistent playback and controls in the floating navigation bar.

### 2. Stop 01 · Welcome Station (`#welcome`)
- **Cinematic Video Atmosphere**: Background video (`assets/welcome-bg.mp4`) of a vintage coastal train arriving at the seaside station.
- **Station Chronometer**: Live real-time departure countdown clock calculating days, hours, minutes, and seconds until the 20 November 2027 celebration in Goa.
- **Hanging Station Sign**: Classic timber and gold railway station signage.

### 3. Stop 02 · The Couple (`#couple`)
- **Authentic Vintage Carriage Frame**: Bride and groom portraits set within a brass railway coach window complete with rivets and cream coach paneling.
- **Interactive Sliding Window Sash**: Tapping the carriage window slides the glass sash upward with sound-less ease.
- **24K Gold Confetti Engine**: An HTML5 Canvas particle system bursts metallic gold confetti and star sparkles upon window opening.

### 4. Stop 03 · Our Story (`#story`)
- **Interactive Scratch-to-Reveal Cards**: Each milestone milestone (Mumbai, Kerala, Goa) is coated with an HTML5 canvas gold foil layer with engraved borders and metallic shimmer.
- **Tactile Rubbing Interaction**: Visitors scratch away the foil with touch or mouse using circular brush strokes with `destination-out` blending.
- **Smart Auto-Clear Threshold**: Automatically dissolves remaining foil and triggers celebratory sparkles once ~32% is cleared.
- **Quick Reveal Option**: Dedicated tap button for immediate accessibility.

### 5. Stop 04 · Our Celebrations (`#celebrations`)
- **15 Traditional Ceremony Cards**: Covers Roka, Engagement, Mehndi, Haldi, Sangeet, Tilak, Baraat, Varmala, Pheras, Reception, and more.
- **3D Keepsake Flip Cards**: Double-sided interactive cards displaying a ceremony portrait on the front and royal wedding itinerary details on the back upon tap/click.
- **Carousel Pagination**: Multi-slide paging with dot indicators, keyboard arrow support, and counter readouts.

### 6. Stop 05 · Our Memories (`#memories`)
- **Carriage Window Gallery (2x2 Grid)**: Keeps 4 memory photographs strictly paired 2 per row across all screens.
- **Royal Velvet Parting Curtains**: Each window features deep ruby velvet curtains with gold braided fringe and tassel tiebacks hung from an ornamental brass rod.
- **Curtain Reveal Animation**: Tapping the window gracefully draws the curtains to the sides (`translateX` easing) to unveil the couple's memory photograph.
- **Lightbox Enlarge Dialog**: Tapping an opened photo opens a high-resolution dialog modal with caption.

### 7. Stop 06 · Venue & Travel (`#venue`)
- **Seaside Destination Pavilion**: Highlighting The Palm Pavilion, Goa.
- **Illustrated Coastal Map**: Artistic coastal route map marking Goa Airport (GOI) and Madgaon Station (MAO).
- **Direct Navigation**: One-click Google Maps destination link.

### 8. Stop 07 · First-Class RSVP Reservation Desk (`#rsvp`)
- **Authentic Train Ticket Styling**: Scalloped carriage punch notches, embossed gold star banner, and perforated ticket divider.
- **Interactive Passenger Stepper**: Brass `[-]` and `[+]` counter synced in real-time with the accessible `<select id="guests">` form field.
- **Custom Attending Cards**: Styled options for *"Joyfully Attending"* (locomotive icon) and *"Celebrating from Afar"* (letter icon).
- **Instant Boarding Pass Preview**: Generates an embossed First-Class Boarding Pass confirmation card upon submission.
- **Preserved Scene Video**: Retains the background train video (`assets/train2.mp4`) as required by project specifications.

### 9. Stop 08 · Guest Guide (`#guide`)
- **Informational Dialog Modals**: Modal drawers for Dress Code, Travel Logistics, and Wedding Team Contact.
- **Farewell Keepsake**: Authentic palm postmark stamp with heartfelt sign-off.

---

## Responsive Design Architecture

- **Mobile View (Primary)**: 
  On phones (`≤ 520px`), the invitation fills the display edge-to-edge for a natural, native application feel.
- **Laptop & Desktop View**:
  On larger displays (`> 520px`), the invitation is presented as a luxury centered showcase (`max-width: 480px`) with rounded corners, a fine gold border, soft shadows, and an ambient coastal gradient background (`#0c363c` to `#061e22` to `#020b0d`).
- **Aspect Ratio Protection**:
  Prevents 9:16 vertical videos and portraits from distorting, zooming, or cropping awkwardly on ultra-wide screens.
- **Always Starts from Top**:
  Browser `scrollRestoration` is set to `manual` and resets to Page 1 (`#welcome`) upon reload, ensuring guests experience the journey from the beginning.

---

## Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Astro 7](https://astro.build) | Ultra-fast Static Site Generation (SSG) with zero JS runtime overhead |
| **Language** | TypeScript / JavaScript (ESM) | Type-safe configuration and browser scripts |
| **Rendering** | HTML5 Canvas | Particle confetti and scratch-off card physics |
| **Styling** | Vanilla CSS3 | 3D transforms, CSS variables, backdrop filters, keyframe animations |
| **Media** | WebP & MP4 | High-fidelity compressed assets and background scenes |
| **Audio** | HTML5 Audio API | Autoplay-compliant celebration music playback |
| **Code Quality** | Prettier + Custom Verifier | Code formatting and automated 70-point validation |

---

## Getting Started

### Prerequisites

- **Node.js**: `v22.22.0` or higher
- **npm**: `v10` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/coastal-wedding-express.git
cd coastal-wedding-express

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:4331](http://localhost:4331) in your browser. To view on a mobile device connected to the same Wi-Fi network, access `http://<your-computer-LAN-IP>:4331`.

### Production Build & Automated Verification

```bash
npm run build
```

The build pipeline automatically executes:
1. `npm run sync` — Synchronizes `src/data/content.ts` into `public/content.js` and compiles client scripts.
2. `npm run check` — Validates event data, font files, and assets.
3. `astro build` — Generates optimized static HTML, CSS, and JS into `dist/`.
4. `npm run verify` — Runs strict automated assertions ensuring all 8 sections, 15 events, and video backgrounds pass inspection.

---

## Project Structure

```
├── public/                       # Static public assets (fonts, video, images)
│   ├── assets/                   # Artwork, photos, and media
│   ├── app.js                    # Compiled browser bundle (generated)
│   ├── content.js                # Compiled JSON content (generated)
│   └── foliage.js                # Botanical animation engine
├── scripts/
│   ├── check.mjs                 # Asset and event integrity checker
│   ├── create-frame.mjs          # Sharp image frame compositor
│   ├── sync.mjs                  # Script bundler and data sync
│   └── verify.mjs                # Automated build verification suite
├── src/
│   ├── components/
│   │   └── CoastalEntrance.astro # Modal entrance gate component
│   ├── data/
│   │   └── content.ts            # Central invitation content & itinerary data
│   ├── layouts/
│   │   └── Layout.astro          # Root HTML layout and metadata
│   ├── pages/
│   │   └── index.astro           # Single-page journey (Stops 1-8)
│   ├── scripts/
│   │   ├── app.js                # Core UI, carousel, and dialog handlers
│   │   ├── countdown.js          # Chronometer timer math
│   │   ├── enhancements.js       # Curtains, scratch cards, confetti, & audio
│   │   └── foliage.js            # Leaf and flower animations
│   └── styles/
│       ├── coastal-animations.css # Scene keyframes
│       ├── countdown.css         # Chronometer styling
│       ├── design-update.css     # Redesigned ticket, scratch, curtains & responsive
│       ├── entrance.css          # Grand entrance pavilion styling
│       ├── events.css            # 3D ceremony flip cards
│       ├── opening.css           # Station signage and typography
│       ├── refinements.css       # Layout adjustments
│       ├── spacing.css           # Spacing and media queries
│       ├── styles.css            # Core base styles
│       └── typography.css        # Serif fonts and headings
├── astro.config.mjs              # Astro configuration
└── package.json
```

---

## Customization Guide

All wedding content, names, dates, ceremonies, and assets are centralized in a single file:

📁 **`src/data/content.ts`**

### Modifying Couple Names & Dates
```typescript
export const content = {
  groom: "Aarav",
  bride: "Meera",
  date: "2027-11-20T18:00:00+05:30",
  dateLabel: "20 NOVEMBER 2027",
  venue: "The Palm Pavilion",
  location: "Goa",
  ...
};
```

### Adding or Reordering Ceremonies
Edit the `events` array in `content.ts`:
```typescript
{
  name: "SANGEET",
  title: "Sangeet Night",
  tagline: "Music, dance, and celebrations under the stars.",
  place: "THE PALM PAVILION · GOA",
  time: "7:00 PM",
  date: "2027-11-19",
  day: "19",
  month: "NOV",
  year: "2027",
  id: "sangeet",
  art: "event_sangeet"
}
```

After modifying `content.ts`, simply run:
```bash
npm run build
```

---

## Deployment

The `dist/` folder contains pure static files ready for deployment on any static hosting provider:

- **GitHub Pages**: Push the repository and set the source branch or GitHub Actions to publish `dist/`.
- **Vercel**: Connect the repository with framework preset set to **Astro**.
- **Netlify**: Set build command to `npm run build` and publish directory to `dist`.
- **Cloudflare Pages**: Connect Git repo and set output folder to `dist`.

---

## License

This project is licensed under the [MIT License](LICENSE).
#   C o a s t a l - W e d d i n g - E x p r e s s - W e b s i t e 
 
 