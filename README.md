# 🎂 Birthday Surprise Website

A handcrafted, emotional, modern, and fully responsive **Birthday Surprise Website** designed to celebrate someone special with warmth, charm, and interactive delight.

---

## 📁 Project Structure

```text
birthday-website/
│
├── index.html                  # Main semantic HTML structure
├── css/
│   ├── style.css               # Core styling, animations, and variables
│   └── responsive.css          # Fluid breakpoints (320px to 4K monitors)
│
├── js/
│   └── main.js                 # Configuration, interactions, audio, & confetti
│
├── images/
│   ├── birthday-person.jpg     # Main hero polaroid photo
│   ├── chiya-memory.jpg        # "Chiya + random talks ☕" memory photo
│   ├── memory-1.jpg            # "Our first photo"
│   ├── memory-2.jpg            # "That random day 😂"
│   ├── memory-3.jpg            # "Road trip sunset 🌅"
│   ├── memory-4.jpg            # "Celebration night 🎂"
│   ├── memory-5.jpg            # "Beach sunset walk 🌊"
│   └── memory-6.jpg            # "One of my favorites ❤️"
│
├── music/
│   └── birthday-music.mp3      # Melodic acoustic music-box birthday song
│
└── README.md                   # Documentation and customization guide
```

---

## ✨ Features & Interactive Highlights

1. **Surprise Intro Overlay**
   - Fullscreen initial greeting (`"Hey [NAME] 👀 I made something for you..."`).
   - Clicking `"Open Your Surprise 🎁"` smoothly unlocks the page, launches confetti, and initiates the background music.

2. **Hero Section with Polaroid Aesthetics**
   - Elegant typography with the birthday person's name.
   - Polaroid-style portrait with subtle rotation, washi-tape detail, and gentle desktop parallax motion.

3. **Dynamic "Level Unlocked" Age Calculator**
   - Accurately computes Years, Months, Days, and Hours dynamically from a single configuration string (`YYYY-MM-DD`).

4. **Heartfelt Birthday Letter**
   - Styled like a warm parchment letter with a ruby wax seal and natural handwriting sign-off.

5. **Photo Memories Gallery & Fullscreen Lightbox**
   - 6 charming polaroid memories with natural rotations and captions.
   - Interactive modal lightbox supporting Previous/Next buttons, keyboard navigation (Escape, Left/Right arrows), and mobile swipe gestures.

6. **Random Memory Generator**
   - `"Show Me a Memory 🎲"` randomly selects a photo, caption, and note with a confetti pop.

7. **Our Little Timeline**
   - Alternating desktop milestones and clean single-column mobile layout chronicling cherished milestones.

8. **"A Few Things That Make You Special"**
   - Interactive appreciation cards highlighting smile, kindness, humor, energy, and support.

9. **Interactive "Open When..." Envelopes**
   - 6 distinct scenarios: *Happy*, *Sad*, *Miss Me*, *Need Motivation*, *Overthinking*, and *Need To Smile*.
   - Clicking an envelope unfolds a dedicated personal letter.

10. **Interactive Birthday Cake & Candle Blowing**
    - CSS-crafted tiered birthday cake with flickering candle flames.
    - Clicking `"Blow the Candles 🕯️"` extinguishes flames with a realistic smoke animation and celebratory message.

11. **Surprise Gift Box Reveal**
    - 3D-styled gift box with golden bow.
    - Clicking `"Tap to open"` pops the lid, triggers confetti, and presents a personalized birthday voucher.

12. **Secret Easter Egg**
    - Clicking the birthday person's name 5 times triggers a secret surprise modal!

13. **Background Music Player with Web Audio Fallback**
    - Respects browser autoplay restrictions.
    - Floating music badge with animated soundwave equalizer bars.
    - Built-in Web Audio API fallback synthesizer ensures music plays even in restricted offline sandboxes.

14. **Custom Canvas Confetti Engine**
    - Lightweight, 60 FPS canvas particle physics with zero external dependencies.

---

## 🛠️ How to Customize

All primary details can be edited directly at the very top of `js/main.js`:

```javascript
/* ================================
   EDIT BIRTHDAY DETAILS HERE
================================ */
const birthdayConfig = {
  name: "Sophia",              // Full or first name
  nickname: "Soph",            // Nickname used on intro screen
  birthday: "2000-09-28",      // YYYY-MM-DD for dynamic age calculation
  relationship: "Best Friend", // Relationship
  music: "music/birthday-music.mp3",
  easterEggClicks: 5           // Clicks needed for the secret easter egg
};
```

### Replacing Images
Simply drop your images into the `images/` directory with matching names:
- `images/birthday-person.jpg`
- `images/memory-1.jpg` through `memory-6.jpg`

### Replacing Music
Replace `music/birthday-music.mp3` with your favorite song. The website will automatically play it with smooth volume fade-in!

---

## 🚀 Running the Website

- **Direct Open**: Double-click `index.html` in any browser (Chrome, Safari, Firefox, Edge).
- **No Node.js, npm, or build tools required!**
- Pure HTML5, CSS3, and modern Vanilla JavaScript.
