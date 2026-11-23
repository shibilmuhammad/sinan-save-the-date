/**
 * Premium Joint Wedding Invitation Website — Interactive Logic
 * Couples: Mohammad Sinan UP & Mubhasira • Safanath UP & Thajuddin P
 * Features: Curtain Opening Video Synchronizer, Cinematic Text Reveal,
 * Luxury Background Music Player, Real-time Countdown & Google Calendar Export.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Enforce manual scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Initialize modules
  initLuxuryParticles();
  initCurtainStageExperience();
  initScratchCard();
  initFloatingMusicPlayer();
  initWeddingCountdown();
  initScrollAnimations();
  initCalendarAndSharing();
});

/* ==========================================================================
   1. CURTAIN OPENING VIDEO & INVITATION REVEAL CONTROLLER
   ========================================================================== */
function initCurtainStageExperience() {
  const video = document.getElementById('curtain-video');
  const staticBg = document.getElementById('static-stage-bg');
  const tapOverlay = document.getElementById('tap-to-open-overlay');
  const tapBtn = document.getElementById('tap-open-btn');
  const textOverlay = document.getElementById('invitation-text-overlay');
  const bgAudio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');

  let hasStarted = false;
  let hasRevealed = false;

  // Function to begin video playback and audio upon tap
  async function startCurtainOpening() {
    if (hasStarted) return;
    hasStarted = true;

    // 1. Smoothly fade out the tap-to-open overlay
    tapOverlay.classList.add('fade-out');

    // 2. Start the new background audio immediately from the beginning
    if (bgAudio) {
      bgAudio.currentTime = 0;
      bgAudio.volume = 0.85;
      bgAudio.play().then(() => {
        if (musicToggle) {
          musicToggle.classList.add('playing');
        }
      }).catch(err => {
        console.log('Audio playback info:', err);
      });
    }

    // 3. Play curtain video (muted so only the chosen song plays)
    if (video) {
      video.muted = true;
      video.currentTime = 0;
      try {
        await video.play();
      } catch (e) {
        console.error('Video playback error, showing stage directly:', e);
        triggerTextReveal();
        return;
      }

      // 4. Monitor video playback to seamlessly catch the opening transition
      let textRevealScheduled = false;

      function scheduleRevealAfterVideoCompletion() {
        if (textRevealScheduled || hasRevealed) return;
        textRevealScheduled = true;

        // Freeze video and lock onto the seamless static stage background
        video.pause();
        if (staticBg) {
          staticBg.style.opacity = '1';
        }

        // Graceful cinematic delay: allow the viewer to absorb the empty stage
        // before starting the staggered calligraphy and typography reveal
        setTimeout(() => {
          triggerTextReveal();
        }, 850);
      }

      video.addEventListener('timeupdate', () => {
        // Only trigger once video has reached its very final frame (7.92s of 8.0s)
        if (video.currentTime >= 7.92) {
          scheduleRevealAfterVideoCompletion();
        }
      });

      video.addEventListener('ended', () => {
        scheduleRevealAfterVideoCompletion();
      });
    } else {
      setTimeout(() => {
        triggerTextReveal();
      }, 500);
    }
  }

  // Trigger unified cinematic slide-in text reveal (all texts slide in together)
  function triggerTextReveal() {
    if (hasRevealed) return;
    hasRevealed = true;

    // Show text container and trigger smooth unified slide-in
    textOverlay.classList.remove('hidden');
    void textOverlay.offsetWidth; // Force reflow
    textOverlay.classList.add('revealed');

    // Unlock page scrolling after the unified slide-in completes
    setTimeout(() => {
      document.body.classList.remove('initial-lock');
    }, 1300);

    // Ensure audio is playing if paused
    if (bgAudio && bgAudio.paused) {
      bgAudio.play().then(() => {
        if (musicToggle) musicToggle.classList.add('playing');
      }).catch(err => console.log('Audio fallback info:', err));
    }
  }

  // Bind tap events
  if (tapBtn) {
    tapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startCurtainOpening();
    });
  }
  if (tapOverlay) {
    tapOverlay.addEventListener('click', startCurtainOpening);
  }
}

/* ==========================================================================
   2. FLOATING BACKGROUND MUSIC CONTROLLER
   ========================================================================== */
function initFloatingMusicPlayer() {
  const musicToggle = document.getElementById('music-toggle');
  const bgAudio = document.getElementById('bg-audio');
  if (!musicToggle || !bgAudio) return;

  musicToggle.addEventListener('click', () => {
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Pause music');
      }).catch(err => console.error('Audio play error:', err));
    } else {
      bgAudio.pause();
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-label', 'Play music');
    }
  });

  // Keep UI synchronized with audio state
  bgAudio.addEventListener('play', () => musicToggle.classList.add('playing'));
  bgAudio.addEventListener('pause', () => musicToggle.classList.remove('playing'));
}

/* ==========================================================================
   3. REAL-TIME COUNTDOWN TIMER (10 January 2027 at 6:00 PM)
   ========================================================================== */
function initWeddingCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Target Date: 10 January 2027 18:00:00 (Local Time)
  const targetDate = new Date('2027-01-10T18:00:00+05:30').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. SCROLL-TRIGGERED SECTION ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const sections = document.querySelectorAll('.scroll-section');
  if (!('IntersectionObserver' in window)) {
    sections.forEach(s => s.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   5. CALENDAR INTEGRATION & WHATSAPP SHARING
   ========================================================================== */
function initCalendarAndSharing() {
  // Event Reminder buttons
  const calButtons = document.querySelectorAll('.add-cal-btn');
  calButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title;
      const venue = btn.dataset.venue;
      const start = btn.dataset.start;
      const end = btn.dataset.end;
      generateGoogleCalendarLink(title, venue, start, end);
    });
  });

  // Save All / Grand Reception CTA
  const saveAllBtn = document.getElementById('save-all-calendar');
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => {
      generateGoogleCalendarLink(
        'Joint Wedding Reception — Mohammad Sinan & Mubhasira • Safanath & Thajuddin',
        'Sagar Auditorium, Panemangalore',
        '2027-01-10T18:00:00',
        '2027-01-10T23:00:00'
      );
    });
  }

  // WhatsApp Share buttons
  const shareBtn = document.getElementById('share-invite-btn');
  const finalShareBtn = document.getElementById('final-share-whatsapp');
  [shareBtn, finalShareBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const shareText = encodeURIComponent(
          `*Joint Wedding Invitation*\n\n` +
          `With the blessings of Allah, we cordially invite you and your family to celebrate the wedding ceremonies of:\n\n` +
          `✦ *Mohammad Sinan UP* & *Mubhasira*\n` +
          `✦ *Safanath UP* & *Thajuddin P*\n\n` +
          `📅 *08 Jan 2027* — Nikkah (A&B Juma Masjid, Kunthoor)\n` +
          `📅 *09 Jan 2027* — Mehendi (Kaje House, Kunthoor)\n` +
          `📅 *10 Jan 2027* — Wedding Reception (Sagar Auditorium, Panemangalore)\n\n` +
          `Kindly view our digital wedding invitation and find directions here:\n${window.location.href}`
        );
        window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
      });
    }
  });
}

function generateGoogleCalendarLink(title, venue, startIso, endIso) {
  const formatCalTime = (iso) => iso.replace(/[-:]/g, '');
  const startFormatted = formatCalTime(startIso);
  const endFormatted = formatCalTime(endIso);

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent('You are cordially invited with family and friends.')}&location=${encodeURIComponent(venue)}&sf=true&output=xml`;

  window.open(url, '_blank');
}

/* ==========================================================================
   6. LUXURY GOLD DUST PARTICLES CANVAS
   ========================================================================== */
function initLuxuryParticles() {
  const canvas = document.getElementById('luxury-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 45;
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.size = Math.random() * 2 + 0.8;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.pulseAngle += this.pulseSpeed;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      const currentAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulseAngle) * 0.25);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(227, 197, 141, ${currentAlpha.toFixed(2)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(245, 215, 158, 0.7)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationId = requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

/* ==========================================================================
   7. INTERACTIVE LUXURY SCRATCH-OFF CARD CONTROLLER
   ========================================================================== */
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const hintPill = document.getElementById('scratch-hint-pill');
  const mainTitle = document.getElementById('scratch-main-title');

  let isDrawing = false;
  let isRevealed = false;
  let hasInteracted = false;

  // Setup High-DPI canvas & paint the single seamless velvet background matching reference
  function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // 1. Draw rich velvet texture image if loaded, or smooth radial velvet gradient
    const velvetImg = new Image();
    velvetImg.src = 'images/velvet.webp';
    velvetImg.onload = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(velvetImg, 0, 0, w, h);
      drawInscription(w, h);
    };

    // Instant fallback gradient
    const grad = ctx.createRadialGradient(w / 2, h / 2, 8, w / 2, h / 2, Math.max(w, h));
    grad.addColorStop(0, '#85112C');
    grad.addColorStop(0.5, '#56071B');
    grad.addColorStop(1, '#2E020D');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    drawInscription(w, h);
  }

  function drawInscription(w, h) {
    ctx.fillStyle = '#F5D79E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '500 12px "Montserrat", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 6;
    ctx.fillText('✦ SCRATCH TO REVEAL ✦', w / 2, h / 2);
    ctx.shadowBlur = 0;
  }

  // Scratch Erase Action
  function scratch(x, y) {
    if (isRevealed) return;

    if (!hasInteracted && hintPill) {
      hasInteracted = true;
      hintPill.classList.add('hidden');
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkScratchCompletion();
  }

  // Calculate percentage of area scratched
  let checkThrottle = null;
  function checkScratchCompletion() {
    if (isRevealed || checkThrottle) return;
    checkThrottle = setTimeout(() => {
      checkThrottle = null;
      try {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const w = Math.floor(rect.width * dpr);
        const h = Math.floor(rect.height * dpr);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        let cleared = 0;
        let total = 0;
        // Sample every 48th pixel
        for (let i = 3; i < data.length; i += 48) {
          total++;
          if (data[i] < 128) {
            cleared++;
          }
        }

        const percentage = (cleared / total) * 100;
        if (percentage >= 38) {
          revealEverything();
        }
      } catch (e) {
        // Fallback for tainted canvas if any
      }
    }, 150);
  }

  // Complete reveal transition
  function revealEverything() {
    if (isRevealed) return;
    isRevealed = true;

    // Fade out canvas smoothly
    canvas.classList.add('fade-out');
    if (hintPill) hintPill.classList.add('hidden');

    // Smoothly transition title to "Our forever begins"
    if (mainTitle) {
      mainTitle.style.transition = 'opacity 0.4s ease';
      mainTitle.style.opacity = '0';
      setTimeout(() => {
        mainTitle.textContent = 'Our forever begins';
        mainTitle.style.opacity = '1';
      }, 400);
    }
  }

  // Get coordinates relative to canvas
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // Mouse Listeners
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const { x, y } = getPos(e);
    scratch(x, y);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    scratch(x, y);
  });

  window.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  // Touch Listeners
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getPos(e);
    scratch(x, y);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    scratch(x, y);
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    isDrawing = false;
  });

  // Initialize canvas after DOM layout settles
  setTimeout(setupCanvas, 200);
  window.addEventListener('resize', () => {
    if (!isRevealed) {
      setupCanvas();
    }
  });
}
