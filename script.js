/* ═══════════════════════════════════════════════════
   KOMPI SAMARTH — Portfolio Script
   Cinematic scroll-driven interactions
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Project Data (All 8 Confirmed Projects) ─── */
  const PROJECTS = [
    {
      id: 1,
      title: 'AI-Based Student Dropout Prediction System',
      category: 'Machine Learning / Education',
      stack: ['Python', 'Streamlit', 'Scikit-learn', 'Random Forest', 'SHAP'],
      description:
        'An explainable machine-learning system predicting student dropout risk using Random Forest and SHAP feature attribution to uncover actionable retention signals.',
      github: null,
      notes: null
    },
    {
      id: 2,
      title: 'StayHub: Property Management System',
      category: 'Software Development / Object-Oriented Programming',
      stack: ['Java', 'Swing', 'OOP'],
      description:
        'A modular desktop property management suite built in Java Swing, applying strict OOP patterns to coordinate leases, tenant tracking, and unit vacancy.',
      github: null,
      notes: null
    },
    {
      id: 3,
      title: 'C-Based Real-Time AI System Monitoring Sidecar',
      category: 'Systems Engineering / Edge ML',
      stack: ['C (C11)', 'POSIX IPC', 'Shared Memory', 'pthread', 'ONNX Runtime C API', 'Linux'],
      description:
        'A high-performance Linux telemetry sidecar in pure C (C11), ingesting process metrics via zero-copy POSIX shared memory with sub-millisecond ONNX neural anomaly detection.',
      github: null,
      notes: null
    },
    {
      id: 4,
      title: 'Nanotechnology-Based Smart Coatings for Corrosion Protection',
      category: 'Materials Science / Engineering Research',
      stack: ['Nanotechnology', 'Materials Science', 'ANSYS / CFD'],
      description:
        'Engineering exploration of multi-tier nanostructured barrier coatings, integrating self-healing microcapsules and electrochemical impedance analysis for corrosion defense.',
      github: null,
      notes: null
    },
    {
      id: 5,
      title: 'S-Shape Air Intake Optimization for a Twin-Compressor Jet Engine',
      category: 'Aerospace Engineering / CFD',
      stack: ['Aerospace Engineering', 'CFD'],
      description:
        'CFD aerodynamic study optimizing an S-shaped intake duct for twin-compressor engines, mitigating boundary-layer separation and swirl distortion.',
      github: null,
      notes: null
    },
    {
      id: 6,
      title: 'Hostel Mess Nutrition, Dining and Planning Survey',
      category: 'Design Research / User-Centred Design',
      stack: ['Design Thinking', 'Survey Research', 'User-Centred Design'],
      description:
        'Human-centred research analyzing dining patterns, nutrition balances, and waste dynamics across 420+ students to optimize mess planning.',
      github: null,
      notes: null
    },
    {
      id: 7,
      title: 'AI-Based News Aggregator with Fake News Detection and Political Bias Analysis',
      category: 'NLP / Machine Learning / Web Development',
      stack: ['Python', 'NLP', 'Machine Learning', 'Web Development'],
      description:
        'An intelligent news pipeline using NLP and sentiment classifiers to analyze media slant, cross-verify source reporting, and flag synthetic misinformation.',
      github: null,
      notes: null
    },
    {
      id: 8,
      title: 'Driver Drowsiness and Alcohol Detection System',
      category: 'Computer Vision / Embedded Systems',
      stack: ['Computer Vision', 'Embedded Systems'],
      description:
        'Real-time driver vigilance monitor combining ocular mesh tracking (EAR / PERCLOS) and MQ-3 embedded sensors for proactive fatigue and alcohol detection.',
      github: null,
      notes: null
    }
  ];

  /* ─── Utility: Detect reduced motion preference ─── */
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Utility: Detect touch device ─── */
  const isTouchDevice = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0;


  /* ═══════════════════════════════════════════════════
     1. SCROLL-DRIVEN REVEAL ANIMATIONS
     ═══════════════════════════════════════════════════ */
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion()) {
      /* Immediately show everything if reduced motion preferred */
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); /* Only reveal once */
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  }


  /* ═══════════════════════════════════════════════════
     2. CUSTOM CURSOR (desktop only)
     ═══════════════════════════════════════════════════ */
  function initCustomCursor() {
    if (isTouchDevice() || prefersReducedMotion()) return;
    if (window.innerWidth < 768) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let rafId = null;

    /* Update dot immediately, ring with interpolation */
    function updateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

      rafId = requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    /* Grow cursor on interactive elements */
    const interactiveElements = document.querySelectorAll(
      'a, button, .skill-tag, .btn, .contact__social-link'
    );
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });

    /* Start animation loop */
    rafId = requestAnimationFrame(updateCursor);

    /* Show cursor after a brief delay to avoid flash */
    setTimeout(() => document.body.classList.add('cursor-ready'), 100);

    /* Cleanup on page hide */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
      } else if (!document.hidden) {
        rafId = requestAnimationFrame(updateCursor);
      }
    });
  }


  /* ═══════════════════════════════════════════════════
     3. PARALLAX EFFECT
     ═══════════════════════════════════════════════════ */
  function initParallax() {
    if (prefersReducedMotion()) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.parentElement.getBoundingClientRect();
        const offsetY = (scrollY - el.parentElement.offsetTop) * speed;
        el.style.transform = `translateY(${offsetY}px)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }


  /* ═══════════════════════════════════════════════════
     4. FILM GRAIN EFFECT (Canvas-based)
     ═══════════════════════════════════════════════════ */
  function initFilmGrain() {
    if (prefersReducedMotion()) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'grain-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    let lastFrame = 0;
    const FPS_INTERVAL = 1000 / 10; /* ~10fps for performance */

    function renderGrain(timestamp) {
      if (timestamp - lastFrame < FPS_INTERVAL) {
        requestAnimationFrame(renderGrain);
        return;
      }
      lastFrame = timestamp;

      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;       /* R */
        data[i + 1] = val;   /* G */
        data[i + 2] = val;   /* B */
        data[i + 3] = 20;    /* A — very subtle */
      }

      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(renderGrain);
    }

    requestAnimationFrame(renderGrain);
  }


  /* ═══════════════════════════════════════════════════
     5. PROJECT PROGRESS & SCRUBBER (01 / 09)
     ═══════════════════════════════════════════════════ */
  function initProjectProgress() {
    const projectScenes = document.querySelectorAll('.project-scene');
    const progressEl = document.querySelector('.project-progress');
    const scrubberEl = document.getElementById('projectScrubber');
    const currentEl = document.getElementById('projectCurrent');
    const totalEl = document.getElementById('projectTotal');
    const scrubberDots = document.querySelectorAll('.scrubber-dot');

    if (!projectScenes.length || !progressEl) return;

    /* Set total count */
    const total = PROJECTS.length;
    if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

    /* Show/hide progress indicator & scrubber rail inside projects section */
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            progressEl.classList.add('visible');
            if (scrubberEl) scrubberEl.classList.add('visible');
          } else {
            progressEl.classList.remove('visible');
            if (scrubberEl) scrubberEl.classList.remove('visible');
          }
        });
      },
      { threshold: 0.05 }
    );

    const projectsSection = document.getElementById('projects');
    if (projectsSection) sectionObserver.observe(projectsSection);

    /* Track which project scene is currently in the active reading zone */
    const projectObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = entry.target.dataset.projectIndex || '1';
            if (currentEl) currentEl.textContent = String(idx).padStart(2, '0');

            /* Sync scrubber rail dot */
            scrubberDots.forEach(dot => {
              if (dot.dataset.scrubberIndex === idx) {
                dot.classList.add('active');
              } else {
                dot.classList.remove('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '-10% 0px -25% 0px'
      }
    );

    projectScenes.forEach(scene => projectObserver.observe(scene));
  }


  /* ═══════════════════════════════════════════════════
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     ═══════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

        /* Update URL without jumping */
        history.pushState(null, '', targetId);
      });
    });
  }


  /* ═══════════════════════════════════════════════════
     7. SCROLL PROGRESS BAR
     ═══════════════════════════════════════════════════ */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    let ticking = false;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${Math.min(progress, 100)}%`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }


  /* ═══════════════════════════════════════════════════
     8. ARCHITECTURE DIAGRAM ANIMATION
     ═══════════════════════════════════════════════════ */
  function initArchitectureAnimation() {
    const archFlow = document.getElementById('archFlow');
    if (!archFlow) return;

    const nodes = archFlow.querySelectorAll('[data-arch-index]');

    if (prefersReducedMotion()) {
      nodes.forEach(node => node.classList.add('arch-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            /* Stagger each node/arrow with increasing delay */
            nodes.forEach(node => {
              const idx = parseInt(node.dataset.archIndex, 10);
              const delay = idx * 120; /* 120ms stagger */
              setTimeout(() => {
                node.classList.add('arch-revealed');
              }, delay);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(archFlow);
  }


  /* ═══════════════════════════════════════════════════
     9. PARTICLE SYSTEM (Hero sand/dust)
     ═══════════════════════════════════════════════════ */
  function initParticles() {
    if (prefersReducedMotion() || isTouchDevice()) return;
    if (window.innerWidth < 768) return;

    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let rafId = null;

    const PARTICLE_COUNT = 35;
    const COLORS = [
      'rgba(213, 185, 141, 0.25)',
      'rgba(213, 185, 141, 0.15)',
      'rgba(241, 230, 208, 0.12)',
      'rgba(200, 107, 50, 0.1)'
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -(Math.random() * 0.4 + 0.1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.3 + 0.1,
        life: Math.random() * 200 + 100
      };
    }

    function initializeParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life--;

        /* Respawn when off-screen or life depleted */
        if (p.y < -10 || p.x < -10 || p.x > width + 10 || p.life <= 0) {
          particles[i] = createParticle();
          particles[i].y = height + 10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    }

    /* Only animate when hero is visible */
    const heroSection = document.getElementById('hero');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!rafId) {
              rafId = requestAnimationFrame(animate);
            }
          } else {
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          }
        });
      },
      { threshold: 0 }
    );

    resize();
    initializeParticles();
    observer.observe(heroSection);

    /* Handle resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initializeParticles();
      }, 200);
    });
  }


  /* ═══════════════════════════════════════════════════
     10. KEYBOARD NAVIGATION ENHANCEMENTS
     ═══════════════════════════════════════════════════ */
  function initKeyboardNav() {
    /* Add visible focus indicator class for keyboard users only */
    let usingKeyboard = false;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        usingKeyboard = true;
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      usingKeyboard = false;
      document.body.classList.remove('keyboard-nav');
    });
  }


  /* ═══════════════════════════════════════════════════
     11. LIVE CLOCK (Bengaluru IST — omeshsengar style)
     ═══════════════════════════════════════════════════ */
  function initLiveClock() {
    const clockEl = document.getElementById('dockClock');
    if (!clockEl) return;

    function updateTime() {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        clockEl.textContent = `BLR ${timeStr} IST`;
      } catch (err) {
        clockEl.textContent = 'BLR 15:00 IST';
      }
    }

    updateTime();
    setInterval(updateTime, 1000);
  }


  /* ═══════════════════════════════════════════════════
     12. SPOTLIGHT CARDS (Mouse-tracking glow)
     ═══════════════════════════════════════════════════ */
  function initSpotlightCards() {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const cards = document.querySelectorAll(
      '.project-graphic, .stayhub-unit, .hud-panel, .about__skills, .dock__link'
    );

    cards.forEach(card => {
      card.classList.add('spotlight-card');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });
  }


  /* ═══════════════════════════════════════════════════
     13. ACTIVE DOCK LINK TRACKING
     ═══════════════════════════════════════════════════ */
  function initActiveNavLinks() {
    const dockLinks = document.querySelectorAll('.dock__link');
    const sections = [
      { id: 'projects', el: document.getElementById('projects') },
      { id: 'about', el: document.getElementById('about') },
      { id: 'contact', el: document.getElementById('contact') }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;
            dockLinks.forEach(link => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach(s => {
      if (s.el) observer.observe(s.el);
    });
  }


  /* ═══════════════════════════════════════════════════
     14. TACTILE AUDIO EFFECTS (Web Audio API)
     ═══════════════════════════════════════════════════ */
  /* ═══════════════════════════════════════════════════
     14. TACTILE AUDIO & DUNE CINEMATIC AMBIENT BGM
     ═══════════════════════════════════════════════════ */
  function initTactileAudio() {
    const sfxBtn = document.getElementById('sfxToggle');
    const sfxLabel = document.getElementById('sfxLabel');
    let audioCtx = null;
    let sfxEnabled = true; // Always ON by default as requested

    function getAudioContext() {
      if (!audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          audioCtx = new AudioCtxClass();
        }
      }
      return audioCtx;
    }

    async function ensureRunningContext() {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch (e) {
          /* browser autoplay policy handled */
        }
      }
      return ctx;
    }

    /* ─── Procedural Dune Ambient BGM Engine ─── */
    class DuneAmbientSoundscape {
      constructor() {
        this.masterGain = null;
        this.isPlaying = false;
        this.nodes = [];
      }

      start(ctx) {
        if (this.isPlaying || !ctx) return;
        try {
          const now = ctx.currentTime;

          // Master volume for ambient BGM: very mild (~0.034) so it sits gently in background
          this.masterGain = ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.0001, now);
          this.masterGain.gain.exponentialRampToValueAtTime(0.034, now + 3.5);
          this.masterGain.connect(ctx.destination);

          // 1. Deep desert sub-bass drone (55Hz / 110Hz)
          const subOsc1 = ctx.createOscillator();
          const subOsc2 = ctx.createOscillator();
          const subFilter = ctx.createBiquadFilter();
          const subGain = ctx.createGain();

          subOsc1.type = 'sine';
          subOsc1.frequency.setValueAtTime(55.0, now); // A1 note
          subOsc2.type = 'triangle';
          subOsc2.frequency.setValueAtTime(110.0, now); // A2 harmonic

          subFilter.type = 'lowpass';
          subFilter.frequency.setValueAtTime(140, now);

          subGain.gain.setValueAtTime(0.4, now);
          subOsc1.connect(subFilter);
          subOsc2.connect(subFilter);
          subFilter.connect(subGain);
          subGain.connect(this.masterGain);

          subOsc1.start(now);
          subOsc2.start(now);
          this.nodes.push(subOsc1, subOsc2, subFilter, subGain);

          // 2. Mystical desert modal spice resonance (D2/D3 with slow breathing filter)
          const padOsc1 = ctx.createOscillator();
          const padOsc2 = ctx.createOscillator();
          const padFilter = ctx.createBiquadFilter();
          const padGain = ctx.createGain();

          padOsc1.type = 'sawtooth';
          padOsc1.frequency.setValueAtTime(73.42, now); // D2
          padOsc2.type = 'sine';
          padOsc2.frequency.setValueAtTime(146.83, now); // D3

          padFilter.type = 'lowpass';
          padFilter.frequency.setValueAtTime(240, now);
          padFilter.Q.setValueAtTime(3.2, now);

          const padLfo = ctx.createOscillator();
          const padLfoGain = ctx.createGain();
          padLfo.frequency.setValueAtTime(0.07, now); // ~14s slow cycle
          padLfoGain.gain.setValueAtTime(70, now);
          padLfo.connect(padFilter.frequency);
          padLfo.start(now);

          padGain.gain.setValueAtTime(0.24, now);
          padOsc1.connect(padFilter);
          padOsc2.connect(padFilter);
          padFilter.connect(padGain);
          padGain.connect(this.masterGain);

          padOsc1.start(now);
          padOsc2.start(now);
          this.nodes.push(padOsc1, padOsc2, padFilter, padGain, padLfo, padLfoGain);

          // 3. Gentle desert wind noise (Filtered pink noise with slow swell)
          const bufferSize = Math.floor(ctx.sampleRate * 2.5);
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99765 * b0 + white * 0.0990460;
            b1 = 0.96300 * b1 + white * 0.2965164;
            b2 = 0.57000 * b2 + white * 1.0526913;
            output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.035;
          }

          const noiseNode = ctx.createBufferSource();
          noiseNode.buffer = noiseBuffer;
          noiseNode.loop = true;

          const windFilter = ctx.createBiquadFilter();
          windFilter.type = 'bandpass';
          windFilter.frequency.setValueAtTime(210, now);
          windFilter.Q.setValueAtTime(1.6, now);

          const windLfo = ctx.createOscillator();
          const windLfoGain = ctx.createGain();
          windLfo.frequency.setValueAtTime(0.05, now); // ~20s slow wind gust cycle
          windLfoGain.gain.setValueAtTime(80, now);
          windLfo.connect(windFilter.frequency);
          windLfo.start(now);

          const windGain = ctx.createGain();
          windGain.gain.setValueAtTime(0.18, now);

          noiseNode.connect(windFilter);
          windFilter.connect(windGain);
          windGain.connect(this.masterGain);
          noiseNode.start(now);

          this.nodes.push(noiseNode, windFilter, windGain, windLfo, windLfoGain);
          this.isPlaying = true;
        } catch (err) {
          console.warn('Dune ambient soundscape prevented:', err);
        }
      }

      stop(ctx) {
        if (!this.isPlaying || !this.masterGain || !ctx) return;
        try {
          const now = ctx.currentTime;
          this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
          this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
          setTimeout(() => {
            this.nodes.forEach(n => {
              try { n.stop?.(); n.disconnect?.(); } catch (_) {}
            });
            this.nodes = [];
            this.isPlaying = false;
          }, 850);
        } catch (_) {
          this.isPlaying = false;
        }
      }
    }

    const ambientBgm = new DuneAmbientSoundscape();

    async function playFeedback(mode = 'click') {
      if (!sfxEnabled) return;
      try {
        const ctx = await ensureRunningContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (mode === 'chime') {
          /* Dual-frequency sci-fi boot chime */
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.28);
        } else {
          /* Crisp mechanical click */
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        }
      } catch (err) {
        console.warn('SFX playback prevented:', err);
      }
    }

    /* ─── Seamless Autoplay Unlock on First User Gesture ─── */
    const userGestureEvents = ['click', 'keydown', 'scroll', 'touchstart'];
    function unlockAudioOnFirstGesture() {
      ensureRunningContext().then(ctx => {
        if (ctx && sfxEnabled && !ambientBgm.isPlaying) {
          ambientBgm.start(ctx);
        }
      });
      userGestureEvents.forEach(evt => {
        window.removeEventListener(evt, unlockAudioOnFirstGesture, { capture: true });
      });
    }
    userGestureEvents.forEach(evt => {
      window.addEventListener(evt, unlockAudioOnFirstGesture, { capture: true, once: true });
    });

    if (sfxBtn) {
      sfxBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        sfxEnabled = !sfxEnabled;
        const ctx = await ensureRunningContext();

        if (sfxEnabled) {
          sfxBtn.classList.add('active');
          if (sfxLabel) sfxLabel.textContent = 'SOUND: ON';
          if (ctx) ambientBgm.start(ctx);
          playFeedback('chime');
        } else {
          sfxBtn.classList.remove('active');
          if (sfxLabel) sfxLabel.textContent = 'SOUND: MUTED';
          if (ctx) ambientBgm.stop(ctx);
        }
      });
    }

    /* Event delegation: plays tactile click on all interactive elements */
    document.addEventListener('click', (e) => {
      if (!sfxEnabled) return;
      const target = e.target.closest(
        'a, button, .skill-tag, .scrubber-dot, .btn, .stayhub-unit, .filter-pill'
      );
      if (target && target !== sfxBtn) {
        playFeedback('click');
      }
    });

    window.__portfolioSFX = {
      isEnabled: () => sfxEnabled,
      playClick: () => playFeedback('click'),
      playChime: () => playFeedback('chime'),
      startAmbient: () => {
        ensureRunningContext().then(ctx => {
          if (ctx) ambientBgm.start(ctx);
        });
      }
    };
  }


  /* ═══════════════════════════════════════════════════
     15. TECHNICAL SPECIFICATIONS & TELEMETRY DATA
     ═══════════════════════════════════════════════════ */
  const TECH_SPECS = {
    1: {
      subsystem: 'ML-ATTR // 01',
      title: 'AI-Based Student Dropout Prediction System',
      domain: 'Applied AI & Machine Learning',
      metrics: [
        { label: 'ROC-AUC SCORE', value: '0.892', meta: '5-Fold Stratified CV' },
        { label: 'MODEL ARCHITECTURE', value: 'Random Forest', meta: '150 Estimators, Max Depth 12' },
        { label: 'EXPLAINABILITY', value: 'TreeSHAP', meta: 'Exact Shapley Polynomial Time' },
        { label: 'TOP PREDICTOR', value: 'Prior GPA', meta: '+0.34 mean |SHAP| impact' }
      ],
      description:
        'Engineered an early-intervention pipeline that predicts academic attrition before semester completion. Rather than a black-box classifier, TreeSHAP decomposes individual risk scores into transparent additive contributions, enabling academic advisors to address specific root causes such as fee delays or LMS disengagement.',
      codeTitle: 'SHAP PIPELINE INFERENCE & ATTRIBUTION (PYTHON)',
      code: `import shap
import numpy as np
from sklearn.ensemble import RandomForestClassifier

class DropoutPredictor:
    def __init__(self, model_path: str = None):
        self.clf = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42)
        self.explainer = None

    def fit_and_explain(self, X_train, y_train):
        self.clf.fit(X_train, y_train)
        # TreeSHAP computes exact Shapley values in polynomial time
        self.explainer = shap.TreeExplainer(self.clf)

    def explain_student(self, feature_vector: np.ndarray):
        prob = self.clf.predict_proba(feature_vector)[:, 1][0]
        shap_values = self.explainer.shap_values(feature_vector)
        # Additive attribution: f(x) = E[f(x)] + sum(phi_i)
        return {
            "dropout_probability": float(prob),
            "base_value": float(self.explainer.expected_value[1]),
            "shap_attribution": shap_values[1][0].tolist()
        }`
    },
    2: {
      subsystem: 'OOP-CORE // 02',
      title: 'StayHub: Property Management System',
      domain: 'Software Engineering / OOP',
      metrics: [
        { label: 'RUNTIME PLATFORM', value: 'Java SE 17', meta: 'Java Swing GUI Framework' },
        { label: 'DESIGN PATTERN', value: 'Strict MVC', meta: 'Decoupled State & Presentation' },
        { label: 'PERSISTENCE', value: 'Serialized I/O', meta: 'Atomic File Commits' },
        { label: 'CONCURRENCY', value: 'SwingWorker', meta: 'Non-blocking Lease Calculation' }
      ],
      description:
        'StayHub implements a desktop suite for property portfolios, enforcing encapsulation and inheritance across units, residential lease agreements, and billing schedules. Real-time vacancy updates and tenant ledgers are rendered through a responsive Java Swing interface with strict type validation.',
      codeTitle: 'LEASE STATE MACHINE & ENTITY MANAGER (JAVA)',
      code: `package com.stayhub.model;

import java.time.LocalDate;
import java.util.UUID;

public class ResidentialUnit extends PropertyUnit {
    private LeaseStatus status = LeaseStatus.VACANT;
    private LeaseAgreement activeLease;

    public synchronized boolean executeLease(Tenant tenant, int durationMonths, double monthlyRent) {
        if (this.status != LeaseStatus.VACANT) {
            throw new IllegalStateException("Unit " + getUnitId() + " is currently " + this.status);
        }
        LocalDate start = LocalDate.now();
        LocalDate end = start.plusMonths(durationMonths);
        this.activeLease = new LeaseAgreement(UUID.randomUUID().toString(), tenant, start, end, monthlyRent);
        this.status = LeaseStatus.OCCUPIED;
        notifyObservers(new PropertyEvent(EventType.LEASE_COMMENCED, this));
        return true;
    }
}`
    },
    3: {
      subsystem: 'SYS-IPC // 03',
      title: 'C-Based Real-Time AI System Monitoring Sidecar',
      domain: 'Systems Engineering / Edge ML',
      metrics: [
        { label: 'IPC LATENCY', value: '< 1.4 µs', meta: 'Zero-copy POSIX Ring Buffer' },
        { label: 'STANDALONE HEAP', value: '0 Bytes', meta: 'Zero malloc in hot telemetry loop' },
        { label: 'INFERENCE ENGINE', value: 'ONNX Runtime', meta: 'Native C API Integration' },
        { label: 'MEMORY BARRIERS', value: 'C11 Atomics', meta: 'Acquire-Release Semantics' }
      ],
      description:
        'A bare-metal C11 Linux daemon that snoops procfs and kernel metrics without interrupting mission-critical services. Telemetry structs are deposited into a POSIX shared-memory circular ring buffer using memory-mapped I/O (mmap). Local ONNX models evaluate anomaly probabilities in sub-millisecond cycles.',
      codeTitle: 'ZERO-COPY RING BUFFER & ATOMIC ACQUIRE (C11)',
      code: `#define _GNU_SOURCE
#include <fcntl.h>
#include <sys/mman.h>
#include <stdatomic.h>
#include <stdint.h>
#include <onnxruntime_c_api.h>

#define RING_BUFFER_SIZE 4096
#define SHM_PATH "/sys_telemetry_shm"

typedef struct {
    uint64_t timestamp_ns;
    uint32_t process_id;
    float cpu_utilization;
    float rss_memory_mb;
    float context_switches_sec;
} TelemetryFrame;

typedef struct {
    _Atomic uint32_t head;
    _Atomic uint32_t tail;
    TelemetryFrame frames[RING_BUFFER_SIZE];
} SharedRingBuffer;

int read_latest_telemetry(SharedRingBuffer *ring, TelemetryFrame *out) {
    uint32_t current_tail = atomic_load_explicit(&ring->tail, memory_order_relaxed);
    uint32_t current_head = atomic_load_explicit(&ring->head, memory_order_acquire);
    if (current_tail == current_head) return 0; // Buffer empty
    *out = ring->frames[current_tail & (RING_BUFFER_SIZE - 1)];
    atomic_store_explicit(&ring->tail, current_tail + 1, memory_order_release);
    return 1;
}`
    },
    4: {
      subsystem: 'MAT-NANO // 04',
      title: 'Nanotechnology-Based Smart Coatings for Corrosion Protection',
      domain: 'Materials Science & Simulation',
      metrics: [
        { label: 'SALT SPRAY ENDURANCE', value: '3,200+ hrs', meta: 'ASTM B117 Compliance' },
        { label: 'BARRIER RESISTANCE', value: '10^8 Ω·cm²', meta: 'Electrochemical Impedance' },
        { label: 'AUTONOMOUS HEALING', value: '94% Recovery', meta: 'pH-Triggered Microcapsules' },
        { label: 'DIFFUSION TORTUOSITY', value: '4.8x Ratio', meta: 'Graphene Nanoflake Alignment' }
      ],
      description:
        'Investigated multi-tier protective nanocoatings combining superhydrophobic surface texturing (SiO2/TiO2), encapsulated self-healing corrosion inhibitors (BTA in mesoporous silica), and a tortuous graphene-reinforced epoxy matrix to impede electrolyte ingress.',
      codeTitle: 'ELECTROCHEMICAL IMPEDANCE EQUIVALENT CIRCUIT',
      code: `# Electrochemical Impedance Spectroscopy (EIS) Model
# Randles Equivalent Circuit with Tortuous Warburg Diffusion Element

def calculate_impedance(omega, R_sol, R_pore, C_c, R_ct, C_dl, sigma_w):
    """
    R_sol: Solution electrolyte resistance (Ohms)
    R_pore: Coating pore barrier resistance (Ohms)
    C_c: Coating dielectric capacitance (Farads)
    R_ct: Charge-transfer reaction resistance (Ohms)
    C_dl: Double-layer interfacial capacitance (Farads)
    sigma_w: Warburg diffusion coefficient (tortuosity factor)
    """
    import numpy as np
    j = 1j
    Z_c = 1.0 / (j * omega * C_c)
    Z_w = (sigma_w / np.sqrt(omega)) * (1.0 - j)
    Z_faradaic = R_ct + Z_w
    Z_dl = 1.0 / (j * omega * C_dl)
    Z_interface = (Z_faradaic * Z_dl) / (Z_faradaic + Z_dl)
    Z_coating = (Z_c * (R_pore + Z_interface)) / (Z_c + R_pore + Z_interface)
    return R_sol + Z_coating`
    },
    5: {
      subsystem: 'AERO-CFD // 05',
      title: 'S-Shape Air Intake Optimization for a Twin-Compressor Jet Engine',
      domain: 'Aerospace Engineering & CFD',
      metrics: [
        { label: 'PRESSURE RECOVERY', value: '0.982 Pt2/Pt0', meta: 'Mach 0.78 Inflow' },
        { label: 'SWIRL DISTORTION', value: '0.041 SC60', meta: 'Twin-Compressor Splitter' },
        { label: 'TURBULENCE MODEL', value: 'k-ω SST', meta: 'Boundary Layer Separation Control' },
        { label: 'DIFFUSION RATIO', value: '1.34 Area Exp.', meta: 'Loss Minimization Contour' }
      ],
      description:
        'Aerodynamic computational fluid dynamics simulation of a bifurcated S-duct intake for supersonic/transonic flight regimes. Parametric wall-curvature optimization and boundary-layer bleed slots were implemented to eliminate cross-flow separation and ensure uniform velocity distributions at both engine face compressor inlets.',
      codeTitle: 'CFD BOUNDARY CONDITIONS & RECOVERY METRIC (ANSYS/OPENFOAM)',
      code: `/* OpenFOAM / Fluent Flow Boundary Condition for S-Duct Ingestion */
inlet
{
    type            totalPressure;
    p0              uniform 101325; // Pa Sea Level Total Pressure
    gamma           1.4;
    value           uniform 78400;  // Static Pressure at Mach 0.78
}

compressor_face_split
{
    type            massFlowRate;
    massFlowRate    uniform 42.6;   // kg/s split equally across compressor 1 & 2
}

/* Pressure Recovery Factor formulation:
   eta_R = (1 / A_face) * int (P_total / P_freestream) dA
   Target: eta_R >= 0.98, Swirl Distortion Index <= 0.05 */`
    },
    6: {
      subsystem: 'HCD-STAT // 06',
      title: 'Hostel Mess Nutrition, Dining and Planning Survey',
      domain: 'Product Research & Design Thinking',
      metrics: [
        { label: 'SAMPLE SIZE', value: 'N = 420', meta: 'Stratified Campus Cohort' },
        { label: 'WASTE REDUCTION', value: '-38% Target', meta: 'Predictive Demand Prep' },
        { label: 'MACRO COMPLIANCE', value: '68:32 Carb/Prot', meta: 'Dietary Nutrition Ratio' },
        { label: 'MENU ROTATION', value: '14-Day Cycle', meta: 'Shannon Diversity Score 2.84' }
      ],
      description:
        'A comprehensive human-centred design inquiry into university residential dining. Combined quantitative survey analytics with on-site workflow audits to identify bottlenecks in food distribution, meal nutritional shortfalls, and dynamic headcounts to prevent culinary overproduction.',
      codeTitle: 'DEMAND PROJECTION & QUEUE SIMULATION (PYTHON/PANDAS)',
      code: `import pandas as pd
import numpy as np

def simulate_mess_queue(n_students: int, arrival_lambda: float, service_rate: float):
    """
    Simulates Poisson arrival of students during 12:15 - 14:00 lunch rush
    to eliminate Station B queue congestion and food temperature loss.
    """
    inter_arrivals = np.random.exponential(1.0 / arrival_lambda, n_students)
    service_times = np.random.exponential(1.0 / service_rate, n_students)
    wait_times = np.zeros(n_students)
    
    current_time = 0.0
    for i in range(1, n_students):
        current_time += inter_arrivals[i]
        wait_times[i] = max(0.0, wait_times[i-1] + service_times[i-1] - inter_arrivals[i])
    
    return {
        "p95_wait_seconds": float(np.percentile(wait_times, 95)),
        "recommended_stations": int(np.ceil(arrival_lambda / service_rate))
    }`
    },
    7: {
      subsystem: 'NLP-BIAS // 07',
      title: 'AI-Based News Aggregator with Fake News Detection and Political Bias Analysis',
      domain: 'NLP & Applied Machine Learning',
      metrics: [
        { label: 'SOURCE VERIFICATION', value: '7 Syndicates', meta: 'Cross-Entity Graph Matching' },
        { label: 'POLARITY MARGIN', value: '+0.04 Neutral', meta: 'Transformer Sentiment Score' },
        { label: 'CREDIBILITY CONF.', value: '94.6%', meta: 'Stylometric + Fact Concordance' },
        { label: 'ENTROPY THRESHOLD', value: '0.12 Clickbait', meta: 'Headline Linguistic Density' }
      ],
      description:
        'An automated news feed analyzer that ingests real-time RSS feeds, extracts core claims via semantic entity linking, and classifies editorial bias across a 5-point spectrum. Transformer models evaluate stylistic exaggeration to differentiate genuine journalism from hallucinated or partisan misinformation.',
      codeTitle: 'STYLOMETRIC BIAS & ENTITY CROSS-CHECK (PYTHON)',
      code: `from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

class BiasDetector:
    def __init__(self, checkpoint="roberta-base-bias"):
        self.tokenizer = AutoTokenizer.from_pretrained(checkpoint)
        self.model = AutoModelForSequenceClassification.from_pretrained(checkpoint)
        self.classes = ["FAR_LEFT", "CENTER_LEFT", "CENTER", "CENTER_RIGHT", "FAR_RIGHT"]

    def analyze_article(self, headline: str, body_text: str):
        inputs = self.tokenizer(headline, body_text[:1024], return_tensors="pt", truncation=True)
        with torch.no_grad():
            logits = self.model(**inputs).logits
            probs = torch.softmax(logits, dim=-1)[0]
        
        bias_idx = torch.argmax(probs).item()
        return {
            "dominant_bias": self.classes[bias_idx],
            "center_affinity": float(probs[2]),
            "confidence": float(probs[bias_idx])
        }`
    },
    8: {
      subsystem: 'CV-EMBED // 08',
      title: 'Driver Drowsiness and Alcohol Detection System',
      domain: 'Computer Vision & Embedded Hardware',
      metrics: [
        { label: 'INFERENCE SPEED', value: '30 FPS', meta: 'Raspberry Pi 4 / Embedded ARM' },
        { label: 'EAR THRESHOLD', value: '< 0.22', meta: 'Eye Aspect Ratio Closed Trigger' },
        { label: 'PERCLOS WINDOW', value: '42% / 60s', meta: 'Percent Eye Closure Benchmark' },
        { label: 'ALCOHOL SENSOR', value: 'MQ-3 Analog', meta: '< 200 ms Fast Interlock Trip' }
      ],
      description:
        'A vehicular safety sidecar utilizing camera facial landmark triangulation to compute real-time Eye Aspect Ratio (EAR) and head pitch. If eyes remain closed beyond 2.0 seconds or MQ-3 sensors register ethanol vapor above legal thresholds, an embedded buzzer alarm and ignition relay cut-off are triggered.',
      codeTitle: 'OCULAR MESH EYE ASPECT RATIO & INTERLOCK (PYTHON/CV2)',
      code: `import numpy as np

def eye_aspect_ratio(eye_landmarks: np.ndarray) -> float:
    """
    Computes EAR from 6 ocular landmarks:
    EAR = (||p2 - p6|| + ||p3 - p5||) / (2 * ||p1 - p4||)
    """
    v1 = np.linalg.norm(eye_landmarks[1] - eye_landmarks[5])
    v2 = np.linalg.norm(eye_landmarks[2] - eye_landmarks[4])
    h = np.linalg.norm(eye_landmarks[0] - eye_landmarks[3])
    ear = (v1 + v2) / (2.0 * h)
    return float(ear)

def evaluate_vigilance(ear_val: float, mq3_analog_val: float, closure_frames: int):
    EAR_THRESHOLD = 0.22
    FRAME_CONSEC_LIMIT = 48  # ~2.0s at 24-30 FPS
    
    drowsy_flag = (ear_val < EAR_THRESHOLD) and (closure_frames >= FRAME_CONSEC_LIMIT)
    alcohol_flag = mq3_analog_val > 0.40  # 0.40V equivalent to 0.05% BAC
    
    return {
        "alarm_active": drowsy_flag or alcohol_flag,
        "cause": "ALCOHOL_LIMIT" if alcohol_flag else ("DROWSINESS" if drowsy_flag else "NORMAL")
    }`
    }
  };


  /* ═══════════════════════════════════════════════════
     16. TACTICAL TOAST NOTIFICATION
     ═══════════════════════════════════════════════════ */
  let toastTimer = null;
  function showTacticalToast(message, duration = 3200) {
    const toast = document.getElementById('tacticalToast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, duration);
  }


  /* ═══════════════════════════════════════════════════
     17. TECHNICAL SPEC & TELEMETRY DRAWER MODAL
     ══════════════════════════════════════════════════ */
  function initTechDrawer() {
    const backdrop = document.getElementById('techDrawerBackdrop');
    const drawer = document.getElementById('techDrawer');
    const closeBtn = document.getElementById('drawerClose');
    const inspectBtns = document.querySelectorAll('.btn-inspect');
    const copyCodeBtn = document.getElementById('btnCopyCode');

    const elSubsystem = document.getElementById('drawerSubsystem');
    const elTitle = document.getElementById('drawerTitle');
    const elMetrics = document.getElementById('drawerMetrics');
    const elDesc = document.getElementById('drawerDesc');
    const elCodeTitle = document.getElementById('drawerCodeTitle');
    const elCode = document.getElementById('drawerCode');

    let activeSnippet = '';

    function openDrawer(projectId) {
      const spec = TECH_SPECS[projectId];
      if (!spec) return;

      if (elSubsystem) elSubsystem.textContent = spec.subsystem;
      if (elTitle) elTitle.textContent = spec.title;
      if (elDesc) elDesc.textContent = spec.description;
      if (elCodeTitle) elCodeTitle.textContent = spec.codeTitle;
      if (elCode) elCode.textContent = spec.code;
      activeSnippet = spec.code;

      if (elMetrics) {
        elMetrics.innerHTML = '';
        spec.metrics.forEach(m => {
          const card = document.createElement('div');
          card.className = 'metric-card';
          card.innerHTML = `
            <span class="metric-card__label">${m.label}</span>
            <span class="metric-card__value">${m.value}</span>
            <span class="metric-card__meta">${m.meta}</span>
          `;
          elMetrics.appendChild(card);
        });
      }

      if (backdrop) {
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      window.__portfolioSFX?.playClick();
    }

    function closeDrawer() {
      if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
      window.__portfolioSFX?.playClick();
    }

    inspectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.getAttribute('data-project-id');
        openDrawer(pid);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeDrawer();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop && backdrop.classList.contains('active')) {
        closeDrawer();
      }
    });

    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', async () => {
        if (!activeSnippet) return;
        try {
          await navigator.clipboard.writeText(activeSnippet);
          showTacticalToast('✓ SPEC SNIPPET COPIED TO CLIPBOARD');
          window.__portfolioSFX?.playChime();
        } catch (err) {
          showTacticalToast('Telemetry snippet ready.');
        }
      });
    }
  }


  /* ═══════════════════════════════════════════════════
     18. KEYBOARD POWER-USER NAVIGATION (J / K)
     ═══════════════════════════════════════════════════ */
  function initKeyboardPowerNav() {
    let isNavigating = false;

    window.addEventListener('keydown', (e) => {
      /* Ignore key events if typing in form or drawer is open */
      const backdrop = document.getElementById('techDrawerBackdrop');
      if (backdrop && backdrop.classList.contains('active')) return;
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const isNext = e.key === 'j' || e.key === 'J' || e.key === 'ArrowDown';
      const isPrev = e.key === 'k' || e.key === 'K' || e.key === 'ArrowUp';

      if (!isNext && !isPrev) return;

      const visibleScenes = Array.from(
        document.querySelectorAll('.project-scene:not(.filtered-dim)')
      );
      if (!visibleScenes.length) return;

      e.preventDefault();
      if (isNavigating) return;
      isNavigating = true;

      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let currentIndex = -1;

      visibleScenes.forEach((scene, i) => {
        const top = scene.offsetTop;
        const bottom = top + scene.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          currentIndex = i;
        }
      });

      let targetIndex;
      if (isNext) {
        targetIndex = currentIndex < visibleScenes.length - 1 ? currentIndex + 1 : 0;
      } else {
        targetIndex = currentIndex > 0 ? currentIndex - 1 : visibleScenes.length - 1;
      }

      const targetScene = visibleScenes[targetIndex];
      if (targetScene) {
        window.__portfolioSFX?.playClick();
        targetScene.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      setTimeout(() => {
        isNavigating = false;
      }, 500);
    });
  }


  /* ═══════════════════════════════════════════════════
     19. DOMAIN FILTER CHIPS
     ═══════════════════════════════════════════════════ */
  function initProjectFilters() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const scenes = document.querySelectorAll('.project-scene');
    const scrubberDots = document.querySelectorAll('.scrubber-dot');
    const projectTotalEl = document.getElementById('projectTotal');

    if (!filterPills.length || !scenes.length) return;

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-filter');
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        let matchCount = 0;
        let firstMatch = null;

        scenes.forEach((scene, idx) => {
          const domain = scene.getAttribute('data-domain');
          const dot = scrubberDots[idx];
          const isMatch = filter === 'all' || domain === filter;

          if (isMatch) {
            scene.classList.remove('filtered-dim');
            if (dot) dot.classList.remove('filtered-dim');
            matchCount++;
            if (!firstMatch) firstMatch = scene;
          } else {
            scene.classList.add('filtered-dim');
            if (dot) dot.classList.add('filtered-dim');
          }
        });

        if (projectTotalEl) {
          projectTotalEl.textContent = String(matchCount).padStart(2, '0');
        }

        window.__portfolioSFX?.playClick();

        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }


  /* ═══════════════════════════════════════════════════
     20. CINEMATIC AMBIENT SUN-ANGLE SHIFT
     ═══════════════════════════════════════════════════ */
  function initAmbientSunlight() {
    let ticking = false;

    function updateSunAngle() {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const p = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      /* Calculate dynamic sun glow position and warmth */
      let sunX, sunY, sunColor;
      if (p < 0.28) {
        /* Midday desert sun */
        sunX = '50%';
        sunY = '20%';
        sunColor = 'rgba(213, 185, 141, 0.06)';
      } else if (p < 0.72) {
        /* Twilight spice glow */
        const subRatio = (p - 0.28) / 0.44;
        sunX = `${45 + subRatio * 20}%`;
        sunY = `${25 + subRatio * 35}%`;
        sunColor = 'rgba(200, 107, 50, 0.085)';
      } else {
        /* Starlit obsidian nightfall */
        sunX = '60%';
        sunY = '65%';
        sunColor = 'rgba(120, 166, 200, 0.055)';
      }

      document.documentElement.style.setProperty('--sun-x', sunX);
      document.documentElement.style.setProperty('--sun-y', sunY);
      document.documentElement.style.setProperty('--sun-color', sunColor);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateSunAngle);
        ticking = true;
      }
    }, { passive: true });

    updateSunAngle();
  }


  /* ═══════════════════════════════════════════════════
     21. TACTILE OUTREACH & COPY EMAIL
     ═══════════════════════════════════════════════════ */
  function initTactileOutreach() {
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyEmailText = document.getElementById('copyEmailText');
    const targetEmail = 'kompisamarth.cs25@rvce.edu.in';

    if (!copyEmailBtn) return;

    copyEmailBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(targetEmail);
        copyEmailBtn.classList.add('copied');
        if (copyEmailText) copyEmailText.textContent = '✓ FREQUENCY COPIED';
        showTacticalToast(`✓ FREQUENCY COPIED · ${targetEmail}`);
        window.__portfolioSFX?.playChime();

        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          if (copyEmailText) copyEmailText.textContent = 'COPY FREQUENCY';
        }, 3000);
      } catch (err) {
        showTacticalToast(`Frequency: ${targetEmail}`);
      }
    });
  }


  /* ═══════════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════════ */
  function init() {
    initRevealAnimations();
    initCustomCursor();
    initParallax();
    initFilmGrain();
    initProjectProgress();
    initSmoothScroll();
    initScrollProgress();
    initArchitectureAnimation();
    initParticles();
    initKeyboardNav();
    initLiveClock();
    initSpotlightCards();
    initActiveNavLinks();
    initTactileAudio();
    initTechDrawer();
    initKeyboardPowerNav();
    initProjectFilters();
    initAmbientSunlight();
    initTactileOutreach();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
