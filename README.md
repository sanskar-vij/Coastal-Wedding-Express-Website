# Raj & Simran · Coastal Wedding Express

### A Luxury, Cinematic & Mobile-First Digital Wedding Invitation

*Eight stops. One beautiful lifetime together.*

<p align="center">
  <img src="https://img.shields.io/badge/Astro-7.4-FF5D01?logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D22.22-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-MIT-gold" alt="MIT License" />
</p>

---

## ✨ Overview

**Coastal Wedding Express** is an interactive, multi-sensory wedding invitation website designed with a nostalgic coastal vintage railway aesthetic. Styled after a royal luxury train journey traversing India’s scenic west coast from Mumbai down to Goa, the invitation guides guests through eight curated "stops" capturing Raj and Simran's love story, wedding ceremonies, travel details, and accommodation.


Designed around a fictional luxury train journey travelling along India's scenic western coastline, from Mumbai to Goa, the experience takes guests through eight beautifully curated destinations.

Each destination reveals a different chapter of Raj and Simran's celebration, combining cinematic visuals, traditional Indian wedding aesthetics, tactile interactions, ambient animations, and elegant storytelling.

Built using **Astro, TypeScript, modern CSS, and vanilla JavaScript**, the experience prioritizes mobile devices while presenting a refined, framed invitation on larger screens.

### The Experience

- 🚂 Eight interactive wedding destinations.
- 💍 Fifteen traditional wedding ceremonies.
- 🎞️ Cinematic background videos and animations.
- ✨ Interactive scratch-to-reveal storytelling.
- 🪟 Vintage railway carriage-inspired photo galleries.
- 🎵 Integrated celebration soundtrack.
- 🎟️ Personalized RSVP and digital boarding pass.
- 📱 Responsive, mobile-first architecture.

---

## 🗺️ The Eight Wedding Destinations

The invitation unfolds as an eight-stop railway journey.

### 01 — Welcome Station

`#welcome`

<details>
<summary>Explore features</summary>

- Cinematic coastal railway background video.
- Live countdown to the wedding celebration on 20 November 2027.
- Classic hanging railway station signage.
- Elegant vintage-inspired typography.
- Real-time days, hours, minutes, and seconds countdown.

</details>

### 02 — The Couple

`#couple`

<details>
<summary>Explore features</summary>

- Bride and groom portraits inside an authentic vintage railway carriage frame.
- Brass detailing, rivets, and traditional cream coach paneling.
- Interactive sliding window sash.
- HTML5 Canvas-powered gold confetti and star particle effects.
- Animated window-opening experience.

</details>

### 03 — Our Story

`#story`

<details>
<summary>Explore features</summary>

- Interactive scratch-to-reveal memory cards.
- Three relationship milestones: Mumbai, Kerala, and Goa.
- Gold foil textures with engraved decorative borders.
- Touch and mouse-based scratching.
- Canvas `destination-out` blending.
- Automatic reveal after approximately 32% of the foil is removed.
- Dedicated quick-reveal accessibility control.
- Celebratory sparkle animations.

</details>

### 04 — Our Celebrations

`#celebrations`

<details>
<summary>Explore features</summary>

- Fifteen traditional Indian wedding ceremony cards.
- Interactive 3D flip-card animations.
- Ceremony artwork on the front.
- Wedding itinerary details on the reverse.
- Multi-slide carousel navigation.
- Pagination dots and slide counters.
- Keyboard arrow navigation.

</details>

### 05 — Our Memories

`#memories`

<details>
<summary>Explore features</summary>

- Four photographs displayed in a consistent 2 × 2 gallery.
- Vintage railway carriage window frames.
- Deep ruby velvet curtains.
- Gold braided fringe and decorative tassels.
- Interactive curtain-opening animations.
- High-resolution image lightbox with captions.

</details>

### 06 — Venue & Travel

`#venue`

<details>
<summary>Explore features</summary>

- Destination wedding venue: The Palm Pavilion, Goa.
- Illustrated coastal travel map.
- Goa Airport (GOI) location reference.
- Madgaon Railway Station (MAO) location reference.
- Direct Google Maps navigation.

</details>

### 07 — First-Class RSVP

`#rsvp`

<details>
<summary>Explore features</summary>

- Vintage railway ticket-inspired RSVP interface.
- Scalloped ticket edges and perforated dividers.
- Embossed gold star detailing.
- Interactive passenger count stepper.
- Custom attendance selection cards:
  - Joyfully Attending.
  - Celebrating from Afar.
- Instant digital First-Class Boarding Pass preview.
- Preserved train background video (`assets/train2.mp4`).

</details>

### 08 — Guest Guide

`#guide`

<details>
<summary>Explore features</summary>

- Interactive information dialogs.
- Dress Code information.
- Travel and accommodation logistics.
- Wedding team contact information.
- Decorative palm postmark.
- Personalized farewell message.

</details>

---

## 🎨 Design & Interactive Architecture

### Grand Entrance Pavilion

The experience begins with a dedicated entrance screen featuring a royal invitation seal and a prominent **BEGIN YOUR JOURNEY** action.

The initial user interaction starts the celebration soundtrack, complying with browser restrictions on audio autoplay.

### Ambient Audio Experience

- HTML5 Audio API.
- User-initiated playback.
- Persistent soundtrack during navigation.
- Floating navigation audio controls.
- Audio file: `assets/wedding-song.mp3`.

### Interactive Visual Effects

| Effect | Implementation |
|---|---|
| Gold confetti | HTML5 Canvas |
| Scratch-to-reveal | Canvas destination-out |
| Window animations | CSS transforms |
| 3D ceremony cards | CSS 3D transforms |
| Velvet curtain reveal | CSS transitions |
| Countdown clock | JavaScript |
| Foliage animations | Custom JavaScript |
| Dialog interactions | Vanilla JavaScript |

---

## 📱 Responsive Design

The website is engineered with a mobile-first approach.

| Device | Experience |
|---|---|
| Mobile (≤ 520px) | Full-screen, edge-to-edge invitation |
| Tablet | Centered responsive presentation |
| Laptop | Framed luxury invitation |
| Desktop | Centered cinematic showcase |

### Desktop Presentation

On screens wider than 520px, the invitation is displayed inside a centered container with:

- Maximum width of 480px.
- Rounded outer corners.
- Fine gold border.
- Soft ambient shadows.
- Deep coastal gradient background.

**Background palette:**

```css
#0c363c
#061e22
#020b0d
```

### Additional Responsive Features

- Maintains the intended vertical presentation of 9:16 video and portrait artwork.
- Prevents unwanted image distortion.
- Preserves the intended visual proportions on ultra-wide displays.
- Uses manual browser scroll restoration.
- Returns guests to the Welcome Station when the page reloads.

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Framework | Astro 7 | Static site generation |
| Language | TypeScript / JavaScript | Application logic and content |
| Styling | Vanilla CSS3 | Responsive layouts and animations |
| Rendering | HTML5 Canvas | Scratch effects and particle systems |
| Animation | CSS / JavaScript | Interactive visual experiences |
| Media | WebP / MP4 | Optimized visual assets |
| Audio | HTML5 Audio API | Celebration soundtrack |
| Image Processing | Sharp | Image composition |
| Formatting | Prettier | Code formatting |
| Validation | Custom Verifier | Automated project checks |

---

## 🚀 Getting Started

### Prerequisites

Ensure the following tools are installed:

- **Node.js:** v22.22.0 or higher.
- **npm:** v10 or higher.
- **Git:** Latest stable version.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/coastal-wedding-express.git
```

### 2. Navigate to the Project

```bash
cd coastal-wedding-express
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the following address:

```text
http://localhost:4331
```

To test the invitation on a mobile device connected to the same Wi-Fi network, use your development machine's local network IP:

```text
http://YOUR-LOCAL-IP:4331
```

---

## 🏗️ Production Build & Verification

Generate the optimized production website:

```bash
npm run build
```

The build pipeline executes four stages:

| Stage | Command | Description |
|---|---|---|
| 01 | `npm run sync` | Synchronizes invitation content and compiles browser scripts |
| 02 | `npm run check` | Validates assets, fonts, and ceremony data |
| 03 | `astro build` | Generates optimized production files |
| 04 | `npm run verify` | Runs automated project verification |

The verification suite checks:

- All eight wedding destinations.
- All fifteen ceremony events.
- Required background videos.
- Asset integrity.
- Project structure and expected elements.

The final production output is generated inside:

```text
dist/
```

---

## 📂 Project Structure

```text
Coastal-Wedding-Express-Website/
│
├── public/
│   ├── assets/
│   │   ├── Artwork, photographs and media
│   │   ├── Background videos
│   │   ├── Audio files
│   │   └── Fonts
│   │
│   ├── app.js
│   ├── content.js
│   └── foliage.js
│
├── scripts/
│   ├── check.mjs
│   ├── create-frame.mjs
│   ├── sync.mjs
│   └── verify.mjs
│
├── src/
│   │
│   ├── components/
│   │   └── CoastalEntrance.astro
│   │
│   ├── data/
│   │   └── content.ts
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── pages/
│   │   └── index.astro
│   │
│   ├── scripts/
│   │   ├── app.js
│   │   ├── countdown.js
│   │   ├── enhancements.js
│   │   └── foliage.js
│   │
│   └── styles/
│       ├── coastal-animations.css
│       ├── countdown.css
│       ├── design-update.css
│       ├── entrance.css
│       ├── events.css
│       ├── opening.css
│       ├── refinements.css
│       ├── spacing.css
│       ├── styles.css
│       └── typography.css
│
├── astro.config.mjs
├── package.json
└── README.md
```

---

## ⚙️ Customization Guide

All primary wedding information, ceremony details, dates, and itinerary content are centrally managed through:

```text
src/data/content.ts
```

### Update Couple Information

Modify the central content configuration:

```typescript
export const content = {
  groom: "Raj",
  bride: "Simran",
  date: "2027-11-20T18:00:00+05:30",
  dateLabel: "20 NOVEMBER 2027",
  venue: "The Palm Pavilion",
  location
