/**
 * ============================================================================
 * BIRTHDAY SURPRISE WEBSITE - CORE JAVASCRIPT
 * Handcrafted with love & attention to detail.
 * ============================================================================
 */

/* ================================
   EDIT BIRTHDAY DETAILS HERE
================================ */
const birthdayConfig = {
  name: "Sophia",
  nickname: "Soph",
  birthday: "2000-09-28", // YYYY-MM-DD
  relationship: "Best Friend",
  music: "music/birthday-music.mp3",
  easterEggClicks: 5
};

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */
const appState = {
  isMusicPlaying: false,
  audioElement: null,
  webAudioCtx: null,
  currentLightboxIndex: 0,
  easterEggCounter: 0,
  candlesBlown: false,
  giftOpened: false,
  photos: [
    {
      src: "images/birthday-girl-frame.jpg",
      caption: "Birthday Girl ❤️",
      note: "May all your days be filled with happiness, peace, and lots of smiles. ❤️🎂"
    }
  ],
  chiyaEasterEggCounter: 0,
  openWhenMessages: {
    happy: {
      kicker: "Open When You're Happy",
      title: "Keep That Glow ✨",
      text: "Whenever you feel happy, take a deep breath and soak it all in. You have worked so hard for your peace and smiles, and you deserve every single ounce of joy in your life. Remember this feeling whenever things get hectic!"
    },
    chiya: {
      kicker: "Open When You Need Chiya ☕",
      title: "Go Boil That Water First! 😂",
      text: "You opened this instead of actually making chiya? 😂 Go make yourself a cup first. And while you're drinking it, remember that somewhere there's someone who already knew you would open this one. ☕❤️"
    },
    sad: {
      kicker: "Open When You're Sad",
      title: "You Are Never Alone ❤️",
      text: "Hey, it is completely okay to have off days. Bad days don't mean a bad life. Wrap yourself in a warm blanket, drink some water, and remember that tomorrow is a fresh page. I am always just a phone call away."
    },
    miss: {
      kicker: "Open When You Miss Me",
      title: "Closer Than You Think 🫂",
      text: "Distance or busy schedules can't change how much I value you. Look through our photo memories on this page, remember our ridiculous inside jokes, and send me a text right now. I'm already smiling thinking about you!"
    },
    motivation: {
      kicker: "Open When You Need Motivation",
      title: "You Have Got This 🌟",
      text: "Look how far you've come. Every obstacle you thought would defeat you is already in the past. You are resilient, incredibly capable, and smarter than you give yourself credit for. Go out there and conquer your goals!"
    },
    overthinking: {
      kicker: "Open When You're Overthinking",
      title: "Breathe In, Breathe Out 🌿",
      text: "99% of the things our minds create in the late hours never happen. Stop spiraling. Put your phone down, listen to calm music, and take three slow, deep breaths. You are safe, you are loved, and everything will be alright."
    },
    smile: {
      kicker: "Open When You Need To Smile",
      title: "Here Is A Reminder 😊",
      text: "Did you know that your laugh is genuinely contagious? Life is so much brighter and more entertaining simply because you are in it. Today is a celebration of you, so let that gorgeous smile shine!"
    }
  }
};

/* ==========================================================================
   DOM INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initPersonalizedContent();
  initIntroScreen();
  initAgeCalculation();
  initTimeAwareBanner();
  initMusicPlayer();
  initVoiceMessagePlayer();
  initParallaxAndHearts();
  initPhotoGallery();
  initGoogleFrameShowcase();
  initBlurredMemory();
  initOpenWhenLetters();
  initCandleInteraction();
  initGiftBox();
  initEasterEgg();
  initChiyaSection();
  initMiniQuiz();
  initUnrealizedObservations();
  initRealChiyaCard();
  initDoNotClickButton();
  initQuietSection();
  initFinalLockedEnvelope();
  initScrollAnimations();
  initReplayButton();
});

/* --------------------------------------------------------------------------
   1. PERSONALIZATION INJECTION
   -------------------------------------------------------------------------- */
function initPersonalizedContent() {
  document.querySelectorAll("[data-bind='name']").forEach(el => {
    el.textContent = birthdayConfig.name;
  });
  document.querySelectorAll("[data-bind='nickname']").forEach(el => {
    el.textContent = birthdayConfig.nickname;
  });
  document.querySelectorAll("[data-bind='relationship']").forEach(el => {
    el.textContent = birthdayConfig.relationship;
  });
}

/* --------------------------------------------------------------------------
   2. INTRO SURPRISE SCREEN & TRANSITION
   -------------------------------------------------------------------------- */
function initIntroScreen() {
  const introOverlay = document.getElementById("intro-overlay");
  const openSurpriseBtn = document.getElementById("open-surprise-btn");

  if (!introOverlay || !openSurpriseBtn) return;

  openSurpriseBtn.addEventListener("click", () => {
    // Fade out overlay
    introOverlay.classList.add("hidden");
    document.body.classList.remove("surprise-locked");

    // Launch celebratory confetti
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 90);

    // Start background music with smooth fade-in
    startBackgroundMusic();
  });
}

/* --------------------------------------------------------------------------
   3. AGE / LEVEL UNLOCKED CALCULATION
   -------------------------------------------------------------------------- */
function initAgeCalculation() {
  const yearsEl = document.getElementById("age-years");
  const monthsEl = document.getElementById("age-months");
  const daysEl = document.getElementById("age-days");
  const hoursEl = document.getElementById("age-hours");
  const levelEl = document.getElementById("age-level-num");

  function calculateAge() {
    const birthDate = new Date(birthdayConfig.birthday + "T00:00:00");
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Days in previous month
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const hours = now.getHours();

    if (yearsEl) yearsEl.textContent = String(years);
    if (monthsEl) monthsEl.textContent = String(months);
    if (daysEl) daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = String(hours);
    if (levelEl) levelEl.textContent = String(years);
  }

  calculateAge();
  // Update counter periodically
  setInterval(calculateAge, 60000);
}

/* --------------------------------------------------------------------------
   4. BACKGROUND MUSIC PLAYER (AUDIO + WEB AUDIO FALLBACK)
   -------------------------------------------------------------------------- */
function initMusicPlayer() {
  const musicBtn = document.getElementById("floating-music-btn");
  if (!musicBtn) return;

  // Initialize HTML5 audio
  appState.audioElement = new Audio(birthdayConfig.music);
  appState.audioElement.loop = true;
  appState.audioElement.volume = 0; // Starts at 0 for fade in

  // If audio fails to load, Web Audio synthesizer handles melody seamlessly
  appState.audioElement.addEventListener("error", () => {
    console.warn("Audio file could not be loaded directly; Web Audio synthesizer will be used.");
  });

  musicBtn.addEventListener("click", () => {
    toggleMusicPlayback();
  });
}

function startBackgroundMusic() {
  const musicBtn = document.getElementById("floating-music-btn");

  if (!appState.audioElement) return;

  const playPromise = appState.audioElement.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        appState.isMusicPlaying = true;
        if (musicBtn) {
          musicBtn.classList.add("playing");
          musicBtn.setAttribute("aria-label", "Pause Music");
        }
        // Smooth volume fade-in
        let vol = 0;
        const fadeInterval = setInterval(() => {
          vol += 0.05;
          if (vol >= 0.7) {
            vol = 0.7;
            clearInterval(fadeInterval);
          }
          if (appState.audioElement) {
            appState.audioElement.volume = vol;
          }
        }, 150);
      })
      .catch(err => {
        console.log("Audio play error, falling back to Web Audio melody:", err);
        playWebAudioMelody();
      });
  }
}

function toggleMusicPlayback() {
  const musicBtn = document.getElementById("floating-music-btn");
  const musicText = musicBtn ? musicBtn.querySelector(".music-label") : null;

  if (appState.isMusicPlaying) {
    if (appState.audioElement) appState.audioElement.pause();
    if (appState.webAudioCtx) appState.webAudioCtx.suspend();
    appState.isMusicPlaying = false;
    if (musicBtn) musicBtn.classList.remove("playing");
    if (musicText) musicText.textContent = "Play Music";
  } else {
    if (appState.audioElement && !appState.audioElement.error) {
      appState.audioElement.play().catch(() => playWebAudioMelody());
    } else {
      playWebAudioMelody();
    }
    if (appState.webAudioCtx && appState.webAudioCtx.state === "suspended") {
      appState.webAudioCtx.resume();
    }
    appState.isMusicPlaying = true;
    if (musicBtn) musicBtn.classList.add("playing");
    if (musicText) musicText.textContent = "Music On";
  }
}

/**
 * Built-in Web Audio API Synthesizer
 * Plays an acoustic music-box rendition of the birthday melody
 */
function playWebAudioMelody() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!appState.webAudioCtx) {
      appState.webAudioCtx = new AudioContext();
    }
    const ctx = appState.webAudioCtx;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const musicBtn = document.getElementById("floating-music-btn");
    if (musicBtn) musicBtn.classList.add("playing");
    appState.isMusicPlaying = true;

    const bpm = 76;
    const beat = 60 / bpm;
    const melodyNotes = [
      { f: 261.63, b: 0.75 }, { f: 261.63, b: 0.25 }, { f: 293.66, b: 1.0 }, { f: 261.63, b: 1.0 }, { f: 349.23, b: 1.0 }, { f: 329.63, b: 2.0 },
      { f: 261.63, b: 0.75 }, { f: 261.63, b: 0.25 }, { f: 293.66, b: 1.0 }, { f: 261.63, b: 1.0 }, { f: 392.00, b: 1.0 }, { f: 349.23, b: 2.0 },
      { f: 261.63, b: 0.75 }, { f: 261.63, b: 0.25 }, { f: 523.25, b: 1.0 }, { f: 440.00, b: 1.0 }, { f: 349.23, b: 1.0 }, { f: 329.63, b: 1.0 }, { f: 293.66, b: 2.0 },
      { f: 466.16, b: 0.75 }, { f: 466.16, b: 0.25 }, { f: 440.00, b: 1.0 }, { f: 349.23, b: 1.0 }, { f: 392.00, b: 1.0 }, { f: 349.23, b: 2.5 }
    ];

    let startTime = ctx.currentTime + 0.1;

    function scheduleTune() {
      let t = startTime;
      melodyNotes.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + (note.b * beat) + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + (note.b * beat) + 0.6);

        t += note.b * beat;
      });

      // Loop after finish
      const totalDur = t - startTime + 2;
      startTime = t + 2;
      setTimeout(() => {
        if (appState.isMusicPlaying) scheduleTune();
      }, totalDur * 1000);
    }

    scheduleTune();
  } catch (e) {
    console.warn("Web audio playback not permitted or supported:", e);
  }
}

/* --------------------------------------------------------------------------
   5. PARALLAX & FLOATING DECORATIONS
   -------------------------------------------------------------------------- */
function initParallaxAndHearts() {
  const container = document.getElementById("floating-background-decor");
  if (!container) return;

  const icons = ["❤️", "✨", "🌸", "🎈", "💖", "⭐", "🎉"];
  const count = window.innerWidth < 768 ? 12 : 24;

  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "decor-item";
    span.textContent = icons[Math.floor(Math.random() * icons.length)];
    span.style.left = Math.random() * 100 + "vw";
    span.style.animationDelay = Math.random() * 15 + "s";
    span.style.animationDuration = 14 + Math.random() * 14 + "s";
    span.style.fontSize = 0.9 + Math.random() * 0.9 + "rem";
    container.appendChild(span);
  }

  // Desktop subtle mouse parallax on hero polaroid frame
  const heroCard = document.querySelector(".photo-frame-polaroid");
  if (heroCard && window.innerWidth > 992) {
    window.addEventListener("mousemove", e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      heroCard.style.transform = `rotate(-2.5deg) translate(${x}px, ${y}px)`;
    });
  }
}

/* --------------------------------------------------------------------------
   6. PHOTO GALLERY & LIGHTBOX (WITH MAGICAL FLOATING HEARTS)
   -------------------------------------------------------------------------- */
function initPhotoGallery() {
  const galleryCards = document.querySelectorAll(".polaroid-card");
  const framedArt = document.getElementById("physical-art-frame");
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption-text");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close-btn");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!lightbox) return;

  function updateLightbox(index) {
    appState.currentLightboxIndex = (index + appState.photos.length) % appState.photos.length;
    const current = appState.photos[appState.currentLightboxIndex];
    if (lightboxImg) {
      lightboxImg.src = current.src;
      lightboxImg.alt = current.caption;
    }
    if (lightboxCaption) lightboxCaption.textContent = current.caption;
    if (lightboxCounter) lightboxCounter.textContent = `${appState.currentLightboxIndex + 1} / ${appState.photos.length}`;
  }

  // Handle click on physical art frame with magical floating hearts & chime
  if (framedArt) {
    const handleFrameReveal = (e) => {
      // 1. Tactile spring press feedback on the physical frame
      framedArt.classList.add("is-clicked");
      setTimeout(() => framedArt.classList.remove("is-clicked"), 550);

      // 2. Glass light sheen sweep across the photograph mat board
      const glare = framedArt.querySelector(".art-frame-glare");
      if (glare) {
        glare.classList.remove("sweeping");
        void glare.offsetWidth; // force reflow for smooth re-trigger
        glare.classList.add("sweeping");
        setTimeout(() => glare.classList.remove("sweeping"), 900);
      }

      // 3. Launch rising constellation of vector floating hearts & sparkles
      launchFloatingHearts(framedArt, e);

      // 4. Play warm, acoustic harmonic dream chime
      playMagicalChime();

      // 5. Trigger subtle celebratory stardust confetti
      const rect = framedArt.getBoundingClientRect();
      const originX = e && e.clientX ? e.clientX : rect.left + rect.width / 2;
      const originY = e && e.clientY ? e.clientY : rect.top + rect.height / 2;
      triggerConfettiBurst(originX, originY, 28, ["✨", "💖", "🌸", "⭐"]);

      // 6. Smoothly open fullscreen lightbox after letting user savor the magical floating hearts
      setTimeout(() => {
        updateLightbox(0);
        lightbox.classList.add("active");
      }, 520);
    };

    framedArt.addEventListener("click", handleFrameReveal);
    framedArt.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleFrameReveal(e);
      }
    });

    // 3D perspective tilt on desktop
    initArtFrame3DTilt(framedArt);
  }

  // Interactive celebrate heart button inside lightbox
  const lightboxHeartBtn = document.getElementById("lightbox-heart-burst-btn");
  if (lightboxHeartBtn) {
    lightboxHeartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      launchFloatingHearts(lightbox, e);
      playMagicalChime();
      triggerConfettiBurst(e.clientX, e.clientY, 25, ["✨", "❤️", "💖"]);
    });
  }

  // Clicking image inside lightbox also releases celebration hearts
  if (lightboxImg) {
    lightboxImg.addEventListener("click", (e) => {
      launchFloatingHearts(lightbox, e);
      playMagicalChime();
    });
  }

  galleryCards.forEach(card => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.getAttribute("data-index") || "0", 10);
      updateLightbox(idx);
      lightbox.classList.add("active");
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => lightbox.classList.remove("active"));
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", e => {
      e.stopPropagation();
      updateLightbox(appState.currentLightboxIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", e => {
      e.stopPropagation();
      updateLightbox(appState.currentLightboxIndex + 1);
    });
  }

  // Click outside image to close
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-container")) {
      lightbox.classList.remove("active");
    }
  });

  // Keyboard navigation
  window.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") lightbox.classList.remove("active");
    if (e.key === "ArrowLeft") updateLightbox(appState.currentLightboxIndex - 1);
    if (e.key === "ArrowRight") updateLightbox(appState.currentLightboxIndex + 1);
  });

  // Mobile Touch Swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  lightbox.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
      updateLightbox(appState.currentLightboxIndex + 1);
    } else if (touchEndX > touchStartX + 50) {
      updateLightbox(appState.currentLightboxIndex - 1);
    }
  }, { passive: true });
}

/**
 * Advanced Magical Floating Hearts & Stardust Constellation Generator
 * Architected with vector SVGs, natural sinusoidal air drafts, and multi-tier depth.
 */
function launchFloatingHearts(frameEl, e) {
  let container = document.getElementById("art-frame-hearts-container");

  // If frameEl is the lightbox modal or body, create or use a global floating container
  if (!container || frameEl.id === "lightbox-modal" || frameEl === document.body) {
    let globalContainer = document.getElementById("global-floating-hearts-layer");
    if (!globalContainer) {
      globalContainer = document.createElement("div");
      globalContainer.id = "global-floating-hearts-layer";
      globalContainer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:visible;";
      document.body.appendChild(globalContainer);
    }
    container = globalContainer;
  }

  const rect = frameEl.getBoundingClientRect();
  const isGlobal = container.id === "global-floating-hearts-layer";

  // Determine click coordinates relative to the chosen container
  const clickX = e && e.clientX ? (isGlobal ? e.clientX : e.clientX - rect.left) : (isGlobal ? rect.left + rect.width / 2 : rect.width / 2);
  const clickY = e && e.clientY ? (isGlobal ? e.clientY : e.clientY - rect.top) : (isGlobal ? rect.top + rect.height / 2 : rect.height / 2);

  // Trigger luminous radial aura expanding wave at click coordinates
  const aura = document.createElement("div");
  aura.className = "frame-aura-burst";
  const auraSize = Math.max(90, Math.min(rect.width ? rect.width * 0.45 : 140, 180));
  aura.style.width = `${auraSize}px`;
  aura.style.height = `${auraSize}px`;
  aura.style.left = `${clickX}px`;
  aura.style.top = `${clickY}px`;
  container.appendChild(aura);
  setTimeout(() => aura.remove(), 1100);

  // Curated color palettes for vector hearts
  const palettes = [
    { fill: "url(#heartGradRuby)", glow: "rgba(255, 42, 109, 0.65)", stroke: "#FF2A6D" },
    { fill: "url(#heartGradRose)", glow: "rgba(244, 63, 94, 0.65)", stroke: "#F43F5E" },
    { fill: "url(#heartGradGold)", glow: "rgba(245, 158, 11, 0.6)", stroke: "#F59E0B" },
    { fill: "url(#heartGradCoral)", glow: "rgba(251, 113, 133, 0.6)", stroke: "#FB7185" },
    { fill: "url(#heartGradBlush)", glow: "rgba(236, 72, 153, 0.55)", stroke: "#EC4899" }
  ];

  // Helper to ensure gradient defs are in DOM
  ensureSvgGradients();

  // Particle distribution: 14 vector hearts + 6 stardust sparkles + 4 fairy dust orbs
  const heartCount = 14;
  const sparkleCount = 6;
  const orbCount = 4;

  // 1. Spawning Vector Hearts
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-frame-heart";

    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    const isOutline = Math.random() < 0.22;
    const heartSize = 16 + Math.floor(Math.random() * 18); // 16px to 34px

    heart.style.width = `${heartSize}px`;
    heart.style.height = `${heartSize}px`;

    heart.innerHTML = isOutline
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="${palette.stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
      : `<svg viewBox="0 0 24 24" fill="${palette.fill}" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    // Organic coordinates dispersed from click center
    const maxSpread = rect.width ? Math.min(rect.width * 0.7, 180) : 120;
    const spreadX = (Math.random() - 0.5) * maxSpread;
    const spreadY = (Math.random() - 0.5) * 60;
    const posX = clickX + spreadX;
    const posY = clickY + spreadY;

    heart.style.left = `${posX}px`;
    heart.style.top = `${posY}px`;

    // Dynamic Kinematics & Trajectory
    const sway1 = (Math.random() - 0.5) * 60;
    const sway2 = (Math.random() - 0.5) * 90;
    const riseDist = -(220 + Math.random() * 150);
    const rotDeg = (Math.random() - 0.5) * 36;
    const duration = 2.4 + Math.random() * 0.8;
    const delay = Math.random() * 0.22;
    const targetScale = (0.9 + Math.random() * 0.45).toFixed(2);

    heart.style.setProperty("--sway-1", `${sway1}px`);
    heart.style.setProperty("--sway-2", `${sway2}px`);
    heart.style.setProperty("--rise-dist", `${riseDist}px`);
    heart.style.setProperty("--rot-deg", `${rotDeg}deg`);
    heart.style.setProperty("--target-scale", targetScale);
    heart.style.setProperty("--float-duration", `${duration}s`);
    heart.style.setProperty("--glow-color", palette.glow);
    heart.style.animationDelay = `${delay}s`;

    container.appendChild(heart);
    setTimeout(() => heart.remove(), (duration + delay + 0.3) * 1000);
  }

  // 2. Spawning Shimmering Stardust Sparkles
  for (let j = 0; j < sparkleCount; j++) {
    const sparkle = document.createElement("div");
    sparkle.className = "floating-frame-sparkle";
    const starSize = 12 + Math.floor(Math.random() * 10);
    sparkle.style.width = `${starSize}px`;
    sparkle.style.height = `${starSize}px`;

    const starColor = Math.random() < 0.5 ? "#FDE047" : "#FFF7ED";
    sparkle.innerHTML = `<svg viewBox="0 0 24 24" fill="${starColor}" aria-hidden="true"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/></svg>`;

    const posX = clickX + (Math.random() - 0.5) * 120;
    const posY = clickY + (Math.random() - 0.5) * 50;
    sparkle.style.left = `${posX}px`;
    sparkle.style.top = `${posY}px`;

    const sparkleX = (Math.random() - 0.5) * 70;
    const sparkleRise = -(180 + Math.random() * 140);
    const sparkleDuration = 2.0 + Math.random() * 0.6;
    const delay = Math.random() * 0.25;

    sparkle.style.setProperty("--sparkle-x", `${sparkleX}px`);
    sparkle.style.setProperty("--sparkle-rise", `${sparkleRise}px`);
    sparkle.style.setProperty("--sparkle-scale", (0.9 + Math.random() * 0.5).toFixed(2));
    sparkle.style.setProperty("--sparkle-duration", `${sparkleDuration}s`);
    sparkle.style.animationDelay = `${delay}s`;

    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), (sparkleDuration + delay + 0.3) * 1000);
  }

  // 3. Spawning Ambient Fairy Dust Micro-Orbs
  for (let k = 0; k < orbCount; k++) {
    const orb = document.createElement("div");
    orb.className = "floating-frame-orb";
    const orbSize = 5 + Math.floor(Math.random() * 6);
    orb.style.width = `${orbSize}px`;
    orb.style.height = `${orbSize}px`;

    const posX = clickX + (Math.random() - 0.5) * 100;
    const posY = clickY + (Math.random() - 0.5) * 40;
    orb.style.left = `${posX}px`;
    orb.style.top = `${posY}px`;

    const orbX = (Math.random() - 0.5) * 50;
    const orbRise = -(190 + Math.random() * 130);
    const orbDuration = 2.2 + Math.random() * 0.6;
    const delay = Math.random() * 0.2;

    orb.style.setProperty("--orb-x", `${orbX}px`);
    orb.style.setProperty("--orb-rise", `${orbRise}px`);
    orb.style.setProperty("--orb-duration", `${orbDuration}s`);
    orb.style.animationDelay = `${delay}s`;

    container.appendChild(orb);
    setTimeout(() => orb.remove(), (orbDuration + delay + 0.3) * 1000);
  }
}

/**
 * Injects reusable SVG gradient defs into the page once
 */
function ensureSvgGradients() {
  if (document.getElementById("magical-hearts-svg-defs")) return;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "magical-hearts-svg-defs";
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
  svg.innerHTML = `
    <defs>
      <linearGradient id="heartGradRuby" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE4E6"/>
        <stop offset="35%" stop-color="#FF2A6D"/>
        <stop offset="100%" stop-color="#BE123C"/>
      </linearGradient>
      <linearGradient id="heartGradRose" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF1F2"/>
        <stop offset="40%" stop-color="#F43F5E"/>
        <stop offset="100%" stop-color="#E11D48"/>
      </linearGradient>
      <linearGradient id="heartGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEF3C7"/>
        <stop offset="45%" stop-color="#FBBF24"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
      <linearGradient id="heartGradCoral" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF7ED"/>
        <stop offset="40%" stop-color="#FB7185"/>
        <stop offset="100%" stop-color="#E11D48"/>
      </linearGradient>
      <linearGradient id="heartGradBlush" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDF2F8"/>
        <stop offset="45%" stop-color="#EC4899"/>
        <stop offset="100%" stop-color="#9D174D"/>
      </linearGradient>
    </defs>
  `;
  document.body.appendChild(svg);
}

/**
 * Warm Acoustic Harmonic Dream Chime via Web Audio API
 * Synthesizes a soft, crystalline dream arpeggio (F#5, A#5, C#6, F#6) with gentle acoustic attack.
 */
function playMagicalChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!appState.webAudioCtx) {
      appState.webAudioCtx = new AudioContext();
    }
    const ctx = appState.webAudioCtx;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Warm dream chord: F#5 (739.99 Hz), A#5 (932.33 Hz), C#6 (1108.73 Hz), F#6 (1479.98 Hz)
    const notes = [
      { freq: 739.99, delay: 0.00, duration: 0.8 },
      { freq: 932.33, delay: 0.07, duration: 0.85 },
      { freq: 1108.73, delay: 0.14, duration: 0.95 },
      { freq: 1479.98, delay: 0.22, duration: 1.15 }
    ];

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.24, now);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, delay, duration }) => {
      const startTime = now + delay;

      // Primary crystalline tone
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, startTime);

      // Subtle warm acoustic harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2800, startTime);

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.16, startTime + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.05);
      osc2.stop(startTime + duration + 0.05);
    });
  } catch (e) {
    // Non-blocking fallback
  }
}

/**
 * Tactile 3D Perspective Tilt on Desktop Hover
 */
function initArtFrame3DTilt(frame) {
  if (!frame || window.innerWidth < 992) return;

  frame.addEventListener("mousemove", (e) => {
    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`;
  });

  frame.addEventListener("mouseleave", () => {
    frame.style.transform = "";
  });
}

/* --------------------------------------------------------------------------
   7. GOOGLE SEARCH BIRTHDAY FRAME SHOWCASE
   -------------------------------------------------------------------------- */
function initGoogleFrameShowcase() {
  const searchInput = document.getElementById("google-search-display-text");
  const pills = document.querySelectorAll(".search-pill-btn");
  const tabs = document.querySelectorAll(".google-tab-item");
  const metaStat = document.getElementById("google-meta-stat-text");

  if (pills && searchInput) {
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        const term = pill.getAttribute("data-search-term");
        searchInput.textContent = term;
        triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, 30, ["✨", "❤️", "🌸", "🍼"]);
      });
    });
  }

  if (tabs) {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const tabType = tab.getAttribute("data-tab");

        if (metaStat) {
          if (tabType === "images") {
            metaStat.textContent = "About 365 days of unconditional love, giggles, and cuteness (0.01 seconds)";
          } else if (tabType === "milestone") {
            metaStat.textContent = "Result: Level 1 officially unlocked! 12 months of pure milestones. 🎉";
          } else if (tabType === "chiya") {
            metaStat.textContent = "Official verdict: Certified Chiya Lover in the making ☕❤️";
          } else if (tabType === "blessings") {
            metaStat.textContent = "May God always bless Syanu with infinite happiness, health, and sweet smiles. 🥹❤️";
          }
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   8. OPEN WHEN... LETTERS
   -------------------------------------------------------------------------- */
function initOpenWhenLetters() {
  const envelopeCards = document.querySelectorAll(".envelope-card");
  const modal = document.getElementById("letter-modal");
  const kickerEl = document.getElementById("letter-modal-kicker");
  const titleEl = document.getElementById("letter-modal-title");
  const contentEl = document.getElementById("letter-modal-content");
  const closeBtn = document.getElementById("letter-modal-close-btn");

  if (!modal) return;

  envelopeCards.forEach(card => {
    card.addEventListener("click", () => {
      const type = card.getAttribute("data-letter-type");
      const letterData = appState.openWhenMessages[type];

      if (letterData) {
        if (kickerEl) kickerEl.textContent = letterData.kicker;
        if (titleEl) titleEl.textContent = letterData.title;
        if (contentEl) contentEl.textContent = letterData.text;

        modal.classList.add("active");
        triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  }

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      modal.classList.remove("active");
    }
  });
}

/* --------------------------------------------------------------------------
   9. BIRTHDAY CAKE & CANDLE INTERACTION
   -------------------------------------------------------------------------- */
function initCandleInteraction() {
  const blowBtn = document.getElementById("blow-candles-btn");
  const cakeScene = document.getElementById("artisan-cake-scene") || document.querySelector(".cake-scene");
  const resultMsg = document.getElementById("wish-result-message");
  const statusText = document.getElementById("cake-status-text");

  if (!blowBtn || !cakeScene) return;

  function playCandleExtinguishChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Soft sparkling arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.6);
      });
    } catch (e) {}
  }

  blowBtn.addEventListener("click", () => {
    if (appState.candlesBlown) {
      // Relight if clicked again
      cakeScene.classList.remove("candles-blown");
      if (resultMsg) resultMsg.classList.remove("revealed");
      if (statusText) statusText.textContent = "Candles are lit • Make your silent wish ✨";
      blowBtn.innerHTML = `<span class="btn-text">Make a Wish & Blow Candles</span> <span class="btn-icon" aria-hidden="true">🕯️</span>`;
      appState.candlesBlown = false;
      return;
    }

    // Extinguish candles with realistic animation
    cakeScene.classList.add("candles-blown");
    appState.candlesBlown = true;
    playCandleExtinguishChime();

    if (statusText) {
      statusText.innerHTML = `Wish locked in! 💫 <span style="font-weight: normal; color: #78350F;">May it all come true!</span>`;
    }

    // Reveal bespoke birthday wish message
    if (resultMsg) {
      resultMsg.classList.add("revealed");
    }

    blowBtn.innerHTML = `<span class="btn-text">Light Candles Again</span> <span class="btn-icon" aria-hidden="true">✨</span>`;

    // Celebratory pastel confetti burst
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 95, ["✨", "🎂", "💖", "🍓"]);
  });
}

/* --------------------------------------------------------------------------
   10. SURPRISE GIFT BOX
   -------------------------------------------------------------------------- */
function initGiftBox() {
  const giftBox = document.getElementById("gift-box-wrapper");
  const giftContent = document.getElementById("gift-revealed-content");

  if (!giftBox || !giftContent) return;

  giftBox.addEventListener("click", () => {
    if (appState.giftOpened) return;

    appState.giftOpened = true;
    giftBox.classList.add("opened");

    setTimeout(() => {
      giftContent.classList.add("active");
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.6, 120);
    }, 450);
  });
}

/* --------------------------------------------------------------------------
   11. SECRET EASTER EGG (CLICK NAME 5 TIMES)
   -------------------------------------------------------------------------- */
function initEasterEgg() {
  const nameTriggers = document.querySelectorAll(".easter-egg-trigger");
  const easterModal = document.getElementById("easter-egg-modal");
  const easterCloseBtn = document.getElementById("easter-egg-close-btn");

  if (!easterModal) return;

  nameTriggers.forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.preventDefault();
      appState.easterEggCounter++;

      // Subtle pulse on each click
      trigger.style.transform = `scale(${1 + appState.easterEggCounter * 0.05})`;
      setTimeout(() => {
        trigger.style.transform = "";
      }, 200);

      if (appState.easterEggCounter >= birthdayConfig.easterEggClicks) {
        easterModal.classList.add("active");
        triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 100);
        appState.easterEggCounter = 0; // Reset
      }
    });
  });

  if (easterCloseBtn) {
    easterCloseBtn.addEventListener("click", () => {
      easterModal.classList.remove("active");
    });
  }

  easterModal.addEventListener("click", e => {
    if (e.target === easterModal) {
      easterModal.classList.remove("active");
    }
  });
}

// =====================================
// CHIYA INTERACTIONS
// =====================================
const chiyaWisdomQuotes = [
  "Life happens. Chiya helps. ☕",
  "Bad mood? Chiya. Good mood? Chiya. Birthday? Definitely chiya.",
  "Some conversations just need a cup of chiya.",
  "Chiya first. Decisions later.",
  "Happiness is sometimes just a warm cup and a peaceful conversation.",
  "One cup of chiya = approximately 37% fewer problems. 😂",
  "Keep calm and let the chiya do its job.",
  "Birthday calories don't count. Neither does birthday chiya. ☕",
  "Tea tastes better when the conversation is good.",
  "There is always time for one more cup.",
  "Behind every brilliant idea is an empty cup of chiya. 💡☕",
  "A cup of hot chiya is a warm hug in liquid form. ❤️"
];

function initChiyaSection() {
  initChiyaMaker();
  initChiyaMeter();
  initChiyaWisdom();
  initChiyaCoupon();
  initChiyaEasterEgg();
}

/**
 * 1. Interactive Make Her Chiya Feature
 */
function initChiyaMaker() {
  const brewBtn = document.getElementById("make-chiya-btn");
  const teacupScene = document.getElementById("teacup-scene");
  const teaLiquid = document.getElementById("teacup-tea-liquid");
  const statusLog = document.getElementById("chiya-status-log");

  if (!brewBtn || !teacupScene || !teaLiquid || !statusLog) return;

  let isBrewing = false;

  brewBtn.addEventListener("click", () => {
    if (isBrewing) return;
    isBrewing = true;
    brewBtn.disabled = true;

    // Step 1: Empty cup reset
    teaLiquid.style.height = "0%";
    teacupScene.classList.remove("steaming");
    statusLog.textContent = "Warming the fine porcelain cup... ✨";

    // Step 2: Pouring tea (liquid rising)
    setTimeout(() => {
      statusLog.textContent = "Pouring freshly simmered CTC black tea with rich whole milk... ☕";
      teaLiquid.style.height = "82%";
      playPorcelainClink();
    }, 600);

    // Step 3: Steam rising
    setTimeout(() => {
      teacupScene.classList.add("steaming");
      statusLog.textContent = "Simmering crushed green cardamom pods, fresh ginger & cinnamon bark... 🌿☕";
    }, 2000);

    // Step 4: Golden milk-tea hue & aromatic spice mist
    setTimeout(() => {
      statusLog.textContent = "Forming the golden spiced milk-tea surface with aromatic tea leaves... ☕✨";
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, 45, ["☕", "✨", "🍃"]);
    }, 3400);

    // Step 5: Ready!
    setTimeout(() => {
      statusLog.innerHTML = `<strong>Your authentic Dudh Chiya is ready! ☕</strong><br/><span style="font-size: 0.85rem; font-weight: normal; color: #92400E;">Warm, spiced, and simmered with care. (Real chiya status is tracked below! 😂)</span>`;
      brewBtn.disabled = false;
      brewBtn.innerHTML = `Brew Another Cup <span aria-hidden="true">☕</span>`;
      isBrewing = false;
    }, 4800);
  });
}

function playPorcelainClink() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1920, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // Audio context silently ignored in restrictive environments
  }
}

/**
 * 2. Chiya Meter
 */
function initChiyaMeter() {
  const slider = document.getElementById("chiya-meter-slider");
  const feedback = document.getElementById("chiya-level-feedback");

  if (!slider || !feedback) return;

  const levels = [
    "Not Much (Is that even possible? 🤨)",
    "A Little ☕",
    "A Lot! ☕☕",
    "Can't Live Without It ☕❤️",
    "Chiya is basically my personality."
  ];

  slider.addEventListener("input", () => {
    const val = parseInt(slider.value, 10);
    const text = levels[val - 1] || levels[2];
    feedback.textContent = text;

    if (val === 5) {
      feedback.innerHTML = `<strong>I knew it. 😂☕</strong> Chiya is basically my personality.`;
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.6, 35, ["☕", "✨", "❤️"]);
    }
  });
}

/**
 * 3. Random Chiya Wisdom
 */
function initChiyaWisdom() {
  const quoteEl = document.getElementById("chiya-wisdom-quote");
  const nextBtn = document.getElementById("another-chiya-wisdom-btn");

  if (!quoteEl || !nextBtn) return;

  let lastIndex = -1;

  function showRandomWisdom() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * chiyaWisdomQuotes.length);
    } while (nextIndex === lastIndex && chiyaWisdomQuotes.length > 1);

    lastIndex = nextIndex;
    quoteEl.style.opacity = "0";
    setTimeout(() => {
      quoteEl.textContent = `“${chiyaWisdomQuotes[nextIndex]}”`;
      quoteEl.style.opacity = "1";
    }, 200);
  }

  nextBtn.addEventListener("click", showRandomWisdom);
}

/**
 * 4. Chiya Date / Coupon Card (Persists in localStorage)
 */
function initChiyaCoupon() {
  const couponCard = document.getElementById("chiya-coupon-card");
  const claimBtn = document.getElementById("claim-chiya-btn");
  const statusEl = document.getElementById("chiya-coupon-status");
  const subtextEl = document.getElementById("chiya-coupon-subtext");

  if (!couponCard || !claimBtn || !statusEl || !subtextEl) return;

  const STORAGE_KEY = "birthday_chiya_coupon_claimed";

  function applyClaimedState() {
    couponCard.classList.add("is-claimed");
    statusEl.textContent = "CLAIMED ✓";
    subtextEl.innerHTML = `<strong>Okay okay... now I actually owe you one chiya. 😂☕</strong><br/>Let me know when and where!`;
    claimBtn.textContent = "Chiya Date Locked In! ☕❤️";
    claimBtn.disabled = true;
    claimBtn.style.opacity = "0.85";
    claimBtn.style.cursor = "default";
  }

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    applyClaimedState();
  }

  claimBtn.addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEY, "true");
    applyClaimedState();
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7, 75, ["☕", "❤️", "✨"]);
  });

  // Developer / testing reset function available in console
  window.resetChiyaCoupon = function () {
    localStorage.removeItem(STORAGE_KEY);
    couponCard.classList.remove("is-claimed");
    statusEl.textContent = "VALID";
    subtextEl.textContent = "Redeemable for one cup of chiya + one good conversation.";
    claimBtn.textContent = "Claim My Chiya ☕";
    claimBtn.disabled = false;
    claimBtn.style.opacity = "1";
    claimBtn.style.cursor = "pointer";
    console.log("Chiya coupon has been reset for testing!");
  };
}

/**
 * 5. Secret Chiya Easter Egg (Click teacup 5 times)
 */
function initChiyaEasterEgg() {
  const teacup = document.getElementById("teacup-scene");
  const modal = document.getElementById("chiya-easter-egg-modal");
  const closeBtn = document.getElementById("chiya-easter-close-btn");

  if (!teacup || !modal) return;

  teacup.addEventListener("click", () => {
    appState.chiyaEasterEggCounter++;

    // Ripple effect on tea surface
    teacup.classList.add("ripple-active");
    setTimeout(() => teacup.classList.remove("ripple-active"), 700);
    playPorcelainClink();

    // Wiggle feedback
    teacup.style.transform = `scale(1.08) rotate(${appState.chiyaEasterEggCounter % 2 === 0 ? -4 : 4}deg)`;
    setTimeout(() => {
      teacup.style.transform = "";
    }, 200);

    if (appState.chiyaEasterEggCounter >= 5) {
      modal.classList.add("active");
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 90, ["☕", "✨", "☕", "🏆"]);
      appState.chiyaEasterEggCounter = 0; // Reset counter
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

/* ==========================================================================
   NEW PERSONAL & INTERACTIVE FEATURE IMPLEMENTATIONS
   ========================================================================== */

/* --------------------------------------------------------------------------
   8. TIME-AWARE BIRTHDAY BANNER
   -------------------------------------------------------------------------- */
function initTimeAwareBanner() {
  const textEl = document.getElementById("time-aware-text");
  if (!textEl) return;

  const hour = new Date().getHours();
  let greeting = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning, birthday girl ☀️ Starting your birthday without chiya would be illegal, obviously. ☕";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Birthday afternoon check: Cake? ✓ Good mood? Hopefully ✓ Chiya? This better be ✓ ☕";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Hope your birthday treated you well today. ✨";
  } else {
    greeting = "Still here? 👀 Okay... one last birthday message before the day ends.";
  }

  textEl.textContent = greeting;
}

/* --------------------------------------------------------------------------
   2. PERSONAL VOICE MESSAGE PLAYER
   -------------------------------------------------------------------------- */
function initVoiceMessagePlayer() {
  const card = document.querySelector(".voice-note-card");
  const playBtn = document.getElementById("voice-play-toggle-btn");
  const playIcon = document.getElementById("voice-play-icon");
  const audio = document.getElementById("voice-audio-element");
  const progressTrack = document.getElementById("voice-progress-track");
  const progressFill = document.getElementById("voice-progress-fill");
  const timeLabel = document.getElementById("voice-time-label");

  if (!playBtn || !card) return;

  let isPlaying = false;
  let synthInterval = null;
  let simulatedSeconds = 0;
  const simulatedDuration = 32;

  function formatTime(sec) {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  }

  function stopPlayback() {
    isPlaying = false;
    card.classList.remove("is-playing");
    if (playIcon) playIcon.className = "fa-solid fa-play";
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    // Restore background music
    if (appState.audioElement && appState.isMusicPlaying) {
      appState.audioElement.volume = 0.7;
    }
  }

  function startSimulatedPlayback() {
    isPlaying = true;
    card.classList.add("is-playing");
    if (playIcon) playIcon.className = "fa-solid fa-pause";

    // Lower background music
    if (appState.audioElement && appState.isMusicPlaying) {
      appState.audioElement.volume = 0.15;
    }

    playAcousticVoiceNoteMelody();

    synthInterval = setInterval(() => {
      simulatedSeconds++;
      const pct = Math.min(100, (simulatedSeconds / simulatedDuration) * 100);
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (timeLabel) timeLabel.textContent = `${formatTime(simulatedSeconds)} / ${formatTime(simulatedDuration)}`;

      if (simulatedSeconds >= simulatedDuration) {
        simulatedSeconds = 0;
        stopPlayback();
      }
    }, 1000);
  }

  if (audio) {
    audio.addEventListener("loadedmetadata", () => {
      if (timeLabel && !isNaN(audio.duration) && audio.duration > 0) {
        timeLabel.textContent = `0:00 / ${formatTime(audio.duration)}`;
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (timeLabel) timeLabel.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
      }
    });

    audio.addEventListener("ended", () => {
      stopPlayback();
    });

    audio.addEventListener("error", () => {
      console.info("Notice: Place recorded voice note at audio/birthday-message.mp3");
    });
  }

  playBtn.addEventListener("click", () => {
    if (!isPlaying) {
      if (audio && audio.src && audio.readyState >= 2) {
        audio.play().then(() => {
          isPlaying = true;
          card.classList.add("is-playing");
          if (playIcon) playIcon.className = "fa-solid fa-pause";
          if (appState.audioElement && appState.isMusicPlaying) {
            appState.audioElement.volume = 0.15;
          }
        }).catch(() => {
          startSimulatedPlayback();
        });
      } else {
        startSimulatedPlayback();
      }
    } else {
      if (audio && !audio.paused) {
        audio.pause();
      }
      stopPlayback();
    }
  });

  if (progressTrack) {
    progressTrack.addEventListener("click", (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (audio && !isNaN(audio.duration) && audio.duration > 0) {
        audio.currentTime = pos * audio.duration;
      } else {
        simulatedSeconds = Math.floor(pos * simulatedDuration);
        if (progressFill) progressFill.style.width = `${pos * 100}%`;
        if (timeLabel) timeLabel.textContent = `${formatTime(simulatedSeconds)} / ${formatTime(simulatedDuration)}`;
      }
    });
  }
}

function playAcousticVoiceNoteMelody() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.45);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.45 + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.45);
      osc.stop(ctx.currentTime + idx * 0.45 + 0.6);
    });
  } catch (e) {}
}

/* --------------------------------------------------------------------------
   6. BLURRED MEMORY REVEAL
   -------------------------------------------------------------------------- */
function initBlurredMemory() {
  const card = document.getElementById("blurred-memory-card");
  const trigger = document.getElementById("blurred-memory-trigger");
  const revealBtn = document.getElementById("blurred-reveal-btn");

  if (!card) return;

  function revealMemory() {
    if (card.classList.contains("is-revealed")) return;
    card.classList.add("is-revealed");
    if (revealBtn) {
      revealBtn.innerHTML = `Memory Revealed ✨ <i class="fa-solid fa-check"></i>`;
      revealBtn.style.background = "#059669";
    }
    setTimeout(() => {
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.6, 60, ["📸", "✨", "☕", "🎉"]);
    }, 900);
  }

  if (revealBtn) revealBtn.addEventListener("click", revealMemory);
  if (trigger) trigger.addEventListener("click", revealMemory);
}

/* --------------------------------------------------------------------------
   1. MINI QUIZ: "HOW WELL DO I KNOW YOU?"
   -------------------------------------------------------------------------- */
const quizQuestions = [
  {
    question: "What can probably fix your mood?",
    options: [
      { text: "Sleep", note: "A solid option, but we both know what really works..." },
      { text: "Money", note: "Helpful, but still not #1 on your emergency list..." },
      { text: "Chiya ☕", note: "Bingo. Instant peace in a warm cup!" },
      { text: "More Chiya 😂", note: "The only mathematically indisputable truth." }
    ]
  },
  {
    question: "Your ideal emergency solution?",
    options: [
      { text: "Call someone", note: "Only after proper contemplation..." },
      { text: "Think carefully", note: "Overthinking mode: actively buffering..." },
      { text: "Panic", note: "Classic, but highly inefficient 😂" },
      { text: "Make chiya first ☕", note: "Priorities in exact required order." }
    ]
  },
  {
    question: "What should NEVER be forgotten?",
    options: [
      { text: "Phone", note: "Essential survival gear..." },
      { text: "Birthday", note: "Especially today! 🎂" },
      { text: "Chiya", note: "Vital life support ☕" },
      { text: "Apparently all of the above 😂", note: "Full marks for absolute accuracy!" }
    ]
  },
  {
    question: "Your typical reaction to hearing good news?",
    options: [
      { text: "Calm celebration", note: "Never seen you that calm 😂" },
      { text: "Text in ALL CAPS", note: "KEYBOARD SMASH COMMENCING" },
      { text: "Wait, really?!", note: "First comes the disbelief..." },
      { text: "Celebrate with chiya ☕", note: "Tradition must be upheld." }
    ]
  },
  {
    question: "Your standard reply time when you're busy?",
    options: [
      { text: "2 seconds", note: "Only during extreme plot twists..." },
      { text: "3 business days", note: "The official processing timeline 😂" },
      { text: "Sorry was making chiya ☕", note: "A 100% legally binding excuse." },
      { text: "Randomly at 2:00 AM 😂", note: "The midnight philosopher arrives." }
    ]
  }
];

function initMiniQuiz() {
  const activeView = document.getElementById("quiz-active-view");
  const resultView = document.getElementById("quiz-result-view");
  const badge = document.getElementById("quiz-step-badge");
  const progressFill = document.getElementById("quiz-progress-fill");
  const questionText = document.getElementById("quiz-question-text");
  const optionsList = document.getElementById("quiz-options-list");
  const feedbackBox = document.getElementById("quiz-feedback-box");
  const retakeBtn = document.getElementById("quiz-retake-btn");

  if (!activeView || !resultView || !optionsList) return;

  let currentIdx = 0;
  let isSelecting = false;

  function renderQuestion(idx) {
    isSelecting = false;
    const q = quizQuestions[idx];
    if (!q) return;

    if (badge) badge.textContent = `Question ${idx + 1} of ${quizQuestions.length}`;
    if (progressFill) progressFill.style.width = `${((idx + 1) / quizQuestions.length) * 100}%`;
    if (questionText) questionText.textContent = q.question;
    if (feedbackBox) {
      feedbackBox.textContent = "";
      feedbackBox.style.opacity = "0";
    }

    optionsList.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option-btn";
      btn.innerHTML = `
        <span class="quiz-option-key">${letters[optIdx] || optIdx + 1}</span>
        <span>${opt.text}</span>
      `;

      btn.addEventListener("click", () => {
        if (isSelecting) return;
        isSelecting = true;

        btn.classList.add("is-selected");
        if (feedbackBox) {
          feedbackBox.textContent = opt.note;
          feedbackBox.style.opacity = "1";
        }

        setTimeout(() => {
          if (currentIdx + 1 < quizQuestions.length) {
            currentIdx++;
            renderQuestion(currentIdx);
          } else {
            // Completed quiz!
            activeView.style.display = "none";
            resultView.classList.add("active");
            triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.6, 70, ["👀", "☕", "🎉", "✨"]);
          }
        }, 1100);
      });

      optionsList.appendChild(btn);
    });
  }

  if (retakeBtn) {
    retakeBtn.addEventListener("click", () => {
      currentIdx = 0;
      resultView.classList.remove("active");
      activeView.style.display = "block";
      renderQuestion(0);
    });
  }

  renderQuestion(0);
}

/* --------------------------------------------------------------------------
   3. THINGS YOU PROBABLY DON'T REALIZE
   -------------------------------------------------------------------------- */
const unrealizedObservations = [
  "You somehow make random conversations interesting.",
  "Your random replies are sometimes funnier than you probably realize. 😂",
  "You're surprisingly easy to talk to when the conversation actually starts.",
  "Your dedication to chiya deserves scientific research. ☕",
  "You have your own way of making ordinary conversations memorable.",
  "Okay, enough compliments. Don't get too confident now. 😂"
];

function initUnrealizedObservations() {
  const quoteEl = document.getElementById("unrealized-quote-text");
  const badgeEl = document.getElementById("unrealized-badge");
  const nextBtn = document.getElementById("unrealized-next-btn");
  const dots = document.querySelectorAll(".unrealized-dot");

  if (!quoteEl || !nextBtn) return;

  let currentIdx = 0;

  function updateObservation(idx) {
    quoteEl.style.opacity = "0";
    quoteEl.style.transform = "translateY(8px)";

    setTimeout(() => {
      quoteEl.textContent = `“${unrealizedObservations[idx]}”`;
      if (badgeEl) badgeEl.textContent = `Observation ${idx + 1} of ${unrealizedObservations.length}`;

      dots.forEach((dot, dIdx) => {
        dot.classList.toggle("active", dIdx === idx);
      });

      if (idx === unrealizedObservations.length - 1) {
        nextBtn.innerHTML = `Start Over <i class="fa-solid fa-rotate-left"></i>`;
      } else {
        nextBtn.innerHTML = `Next <i class="fa-solid fa-arrow-right"></i>`;
      }

      quoteEl.style.opacity = "1";
      quoteEl.style.transform = "translateY(0)";
    }, 200);
  }

  nextBtn.addEventListener("click", () => {
    currentIdx = (currentIdx + 1) % unrealizedObservations.length;
    updateObservation(currentIdx);
  });
}

/* --------------------------------------------------------------------------
   7. REAL CHIYA PROMISE / STATUS CARD
   -------------------------------------------------------------------------- */
function initRealChiyaCard() {
  const btn = document.getElementById("check-real-chiya-btn");
  const revealBox = document.getElementById("real-chiya-revealed-status");

  if (!btn || !revealBox) return;

  btn.addEventListener("click", () => {
    revealBox.classList.add("active");
    btn.innerHTML = `Status Checked ✓`;
    btn.disabled = true;
    btn.style.opacity = "0.85";
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7, 40, ["☕", "✨"]);
  });
}

/* --------------------------------------------------------------------------
   4. DEVELOPER-STYLE PERSONALITY SCANNER (TERMINAL)
   -------------------------------------------------------------------------- */
function initDeveloperScan() {
  const runBtn = document.getElementById("terminal-run-again-btn");
  const valChiya = document.getElementById("val-chiya");
  const valRandom = document.getElementById("val-random");
  const valOverthinking = document.getElementById("val-overthinking");
  const fills = document.querySelectorAll(".terminal-metric-bar-fill");

  if (!runBtn) return;

  function runDiagnostics() {
    fills.forEach(fill => {
      fill.style.width = "0%";
    });

    setTimeout(() => {
      const chiyaPct = 98 + Math.floor(Math.random() * 3); // 98 - 100%
      const randomPct = 83 + Math.floor(Math.random() * 12); // 83 - 94%
      const overthinkingPct = 68 + Math.floor(Math.random() * 11); // 68 - 78%

      if (valChiya) valChiya.textContent = `${chiyaPct}% ☕`;
      if (valRandom) valRandom.textContent = `${randomPct}%`;
      if (valOverthinking) valOverthinking.textContent = `${overthinkingPct}%`;

      fills.forEach(fill => {
        const target = fill.getAttribute("data-target") || "90%";
        fill.style.width = target;
      });

      playPorcelainClink();
    }, 400);
  }

  runBtn.addEventListener("click", () => {
    runBtn.textContent = "[ RUNNING... ]";
    runDiagnostics();
    setTimeout(() => {
      runBtn.textContent = "[ RUN AGAIN ]";
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   5. "DO NOT CLICK" BUTTON
   -------------------------------------------------------------------------- */
function initDoNotClickButton() {
  const btn = document.getElementById("do-not-click-btn");
  const warnText = document.getElementById("do-not-click-warning-text");
  const secretBox = document.getElementById("secret-revealed-box");

  if (!btn || !warnText || !secretBox) return;

  let clickCount = 0;

  btn.addEventListener("click", () => {
    clickCount++;
    btn.classList.add("shake-btn");
    setTimeout(() => btn.classList.remove("shake-btn"), 450);

    if (clickCount === 1) {
      warnText.textContent = "I literally said don't click it. 😭";
      btn.textContent = "Seriously, don't.";
    } else if (clickCount === 2) {
      warnText.textContent = "Again?? 😂";
      btn.textContent = "Last warning.";
    } else if (clickCount >= 3) {
      btn.textContent = "Okay... you asked for it.";
      btn.disabled = true;
      warnText.textContent = "";
      secretBox.classList.add("active");
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.6, 75, ["😹", "✨", "🎁", "🎉"]);
    }
  });
}

/* --------------------------------------------------------------------------
   9. ONE QUIET / SERIOUS SECTION
   -------------------------------------------------------------------------- */
function initQuietSection() {
  const quietSection = document.getElementById("quiet-section");
  if (!quietSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.classList.add("quiet-mode-active");
        if (appState.audioElement && appState.isMusicPlaying) {
          appState.audioElement.volume = 0.22;
        }
      } else {
        document.body.classList.remove("quiet-mode-active");
        if (appState.audioElement && appState.isMusicPlaying) {
          appState.audioElement.volume = 0.7;
        }
      }
    });
  }, { threshold: 0.25 });

  observer.observe(quietSection);
}

/* --------------------------------------------------------------------------
   10. FINAL LOCKED ENVELOPE
   -------------------------------------------------------------------------- */
function initFinalLockedEnvelope() {
  const box = document.getElementById("final-envelope-box");
  const openBtn = document.getElementById("open-final-envelope-btn");
  const trigger = document.getElementById("final-envelope-trigger");
  const letter = document.getElementById("final-letter-unfolded");

  if (!box || !letter) return;

  function openEnvelope() {
    if (box.classList.contains("is-opened")) return;
    box.classList.add("is-opened");
    if (openBtn) {
      openBtn.innerHTML = `Opened with Care ✨`;
      openBtn.disabled = true;
      openBtn.style.opacity = "0.85";
    }
    setTimeout(() => {
      letter.classList.add("active");
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7, 75, ["💌", "✨", "☕", "🎂"]);
    }, 450);
  }

  if (openBtn) openBtn.addEventListener("click", openEnvelope);
  if (trigger) trigger.addEventListener("click", openEnvelope);
}

/* --------------------------------------------------------------------------
   12. INTERSECTION OBSERVER SCROLL REVEAL & LETTER TYPEWRITER
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach(el => observer.observe(el));

  // Navbar Scrollspy: Automatically update active link on scroll
  const navLinks = document.querySelectorAll(".header-nav .nav-link");
  const trackedSections = [
    { id: "hero", link: document.querySelector('.header-nav a[href="#hero"]') },
    { id: "letter-section", link: document.querySelector('.header-nav a[href="#letter-section"]') },
    { id: "gallery-section", link: document.querySelector('.header-nav a[href="#gallery-section"]') },
    { id: "chiya-section", link: document.querySelector('.header-nav a[href="#chiya-section"]') },
    { id: "wishes-section", link: document.querySelector('.header-nav a[href="#wishes-section"]') }
  ];

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 120;
    let currentId = "hero";

    trackedSections.forEach(item => {
      const sec = document.getElementById(item.id);
      if (sec && sec.offsetTop <= scrollPos) {
        currentId = item.id;
      }
    });

    trackedSections.forEach(item => {
      if (item.link) {
        if (item.id === currentId) {
          item.link.classList.add("active");
        } else {
          item.link.classList.remove("active");
        }
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   13. REPLAY SURPRISE BUTTON
   -------------------------------------------------------------------------- */
function initReplayButton() {
  const replayBtn = document.getElementById("replay-surprise-btn");
  if (!replayBtn) return;

  replayBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    triggerConfettiBurst(window.innerWidth / 2, 200, 100);
  });
}

/* --------------------------------------------------------------------------
   14. CUSTOM CANVAS CONFETTI ENGINE (NO EXTERNAL LIBS)
   -------------------------------------------------------------------------- */
let confettiParticles = [];
let confettiAnimationId = null;

function triggerConfettiBurst(originX, originY, particleCount = 70, emojis = null) {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#E11D48", "#FDA4AF", "#D97706", "#FDE047", "#60A5FA", "#F472B6", "#A78BFA"
  ];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: emojis ? (18 + Math.random() * 10) : (6 + Math.random() * 6),
      color: colors[Math.floor(Math.random() * colors.length)],
      emoji: emojis ? emojis[Math.floor(Math.random() * emojis.length)] : null,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.18 + Math.random() * 0.1,
      opacity: 1,
      decay: 0.008 + Math.random() * 0.008
    });
  }

  if (!confettiAnimationId) {
    runConfettiLoop(canvas, ctx);
  }
}

function runConfettiLoop(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.opacity -= p.decay;

    if (p.opacity <= 0 || p.y > canvas.height + 20) {
      confettiParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;

    if (p.emoji) {
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.emoji, 0, 0);
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    }

    ctx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(() => runConfettiLoop(canvas, ctx));
  } else {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
