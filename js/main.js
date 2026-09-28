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
      src: "images/birthday-person.jpg",
      caption: "The birthday star ✨",
      note: "Radiating joy and warmth as always."
    },
    {
      src: "images/memory-1.jpg",
      caption: "Our first photo",
      note: "That sunny afternoon cafe where hours felt like minutes."
    },
    {
      src: "images/memory-2.jpg",
      caption: "That random day 😂",
      note: "Spontaneous laughs, picnic blankets, and zero worries."
    },
    {
      src: "images/memory-3.jpg",
      caption: "Road trip sunset 🌅",
      note: "Golden hour skies, favorite songs, and the best company."
    },
    {
      src: "images/memory-4.jpg",
      caption: "Celebration night 🎂",
      note: "Surrounded by fairy lights and unforgettable moments."
    },
    {
      src: "images/memory-5.jpg",
      caption: "Beach sunset walk 🌊",
      note: "Carefree steps along the water and endless talks."
    },
    {
      src: "images/memory-6.jpg",
      caption: "One of my favorites ❤️",
      note: "Cozy evenings filled with heartfelt conversations."
    }
  ],
  openWhenMessages: {
    happy: {
      kicker: "Open When You're Happy",
      title: "Keep That Glow ✨",
      text: "Whenever you feel happy, take a deep breath and soak it all in. You have worked so hard for your peace and smiles, and you deserve every single ounce of joy in your life. Remember this feeling whenever things get hectic!"
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
  initMusicPlayer();
  initParallaxAndHearts();
  initPhotoGallery();
  initRandomMemory();
  initOpenWhenLetters();
  initCandleInteraction();
  initGiftBox();
  initEasterEgg();
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
   6. PHOTO GALLERY & LIGHTBOX
   -------------------------------------------------------------------------- */
function initPhotoGallery() {
  const galleryCards = document.querySelectorAll(".polaroid-card");
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
      // Swiped left -> next
      updateLightbox(appState.currentLightboxIndex + 1);
    } else if (touchEndX > touchStartX + 50) {
      // Swiped right -> prev
      updateLightbox(appState.currentLightboxIndex - 1);
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   7. RANDOM MEMORY BUTTON
   -------------------------------------------------------------------------- */
function initRandomMemory() {
  const randomBtn = document.getElementById("random-memory-btn");
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption-text");
  const lightboxCounter = document.getElementById("lightbox-counter");

  if (!randomBtn || !lightbox) return;

  randomBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * appState.photos.length);
    appState.currentLightboxIndex = randomIndex;
    const current = appState.photos[randomIndex];

    if (lightboxImg) {
      lightboxImg.src = current.src;
      lightboxImg.alt = current.caption;
    }
    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<strong>${current.caption}</strong><div style="font-size: 0.95rem; font-weight: 400; color: #CBD5E1; margin-top: 4px;">${current.note}</div>`;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `Random Memory 🎲 (${randomIndex + 1} / ${appState.photos.length})`;
    }

    lightbox.classList.add("active");
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
  });
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
  const cakeScene = document.querySelector(".cake-scene");
  const resultMsg = document.getElementById("wish-result-message");

  if (!blowBtn || !cakeScene) return;

  blowBtn.addEventListener("click", () => {
    if (appState.candlesBlown) {
      // Relight if clicked again
      cakeScene.classList.remove("candles-blown");
      if (resultMsg) resultMsg.classList.remove("revealed");
      blowBtn.innerHTML = `Blow the Candles <span aria-hidden="true">🕯️</span>`;
      appState.candlesBlown = false;
      return;
    }

    // Blow candles out
    cakeScene.classList.add("candles-blown");
    appState.candlesBlown = true;

    // Reveal message
    if (resultMsg) {
      resultMsg.classList.add("revealed");
    }

    blowBtn.innerHTML = `Light Candles Again <span aria-hidden="true">✨</span>`;

    // Confetti celebration
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 80);
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

function triggerConfettiBurst(originX, originY, particleCount = 70) {
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
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
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
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
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
