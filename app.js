/**
 * Sorry Moti ❤️ - Main Application Script
 * Sibling apology interaction, Web Audio synthesizer chime, multi-stage screens & notification system.
 */

(function () {
  'use strict';

  // ==========================================================================
  // NOTIFICATION CONFIGURATION
  // To receive instant notifications when Moti clicks a button:
  // 1. (Optional) Paste your Discord Webhook URL below
  // 2. (Optional) Paste your WhatsApp Phone number (with country code, e.g., '923001234567')
  // ==========================================================================
  const NOTIFICATION_CONFIG = {
    // Paste Discord Webhook URL here if you have one (or Telegram / custom webhook):
    DISCORD_WEBHOOK_URL: '',
    // Your WhatsApp number (e.g. '923001234567') or leave empty for contact picker:
    WHATSAPP_PHONE: '',
    // Optional Web3Forms / Formspree endpoint:
    FORMSPREE_ENDPOINT: ''
  };

  // DOM Elements - Screens
  const openingScreen = document.getElementById('openingScreen');
  const sadScreen = document.getElementById('sadScreen');
  const mainLetterScreen = document.getElementById('mainLetterScreen');
  const successScreen = document.getElementById('successScreen');

  // DOM Elements - Buttons & Controls
  const openForgiveBtn = document.getElementById('openForgiveBtn');
  const openTeaseBtn = document.getElementById('openTeaseBtn');
  const sadForgiveBtn = document.getElementById('sadForgiveBtn');
  const pleadMoreBtn = document.getElementById('pleadMoreBtn');
  const pleadMoreText = document.getElementById('pleadMoreText');
  const sadTooltip = document.getElementById('sadTooltip');
  const proceedCelebrationBtn = document.getElementById('proceedCelebrationBtn');
  const readAgainBtn = document.getElementById('readAgainBtn');
  const moreHeartsBtn = document.getElementById('moreHeartsBtn');
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const whatsappNotifyLink = document.getElementById('whatsappNotifyLink');
  const heartBadge1 = document.getElementById('heartBadge1');
  const heartBadge2 = document.getElementById('heartBadge2');

  // State
  let soundEnabled = true;
  let audioCtx = null;
  let pleadCount = 0;

  const pleadPhrases = [
    'Thoda aur manao 🙈',
    'Aur thoda sa... 🥺',
    'Ice-cream khilaoge? 🍦',
    'Pakka promise? 🤞',
    'Chalo maan gayi! 🥹💕'
  ];

  const pleadTooltips = [
    'Please na Moti maan jao! 🥺',
    'Bhaiyoo sad ho gaya bohot 😭',
    '2 Chocolates pakki tumhari! 🍫🍫',
    'Pakka promise ab ghalti nahi hogi! ❤️',
    'Yay! Jaldi "Chalo Maaf Kiya" dabao! 🥰'
  ];

  // --------------------------------------------------------------------------
  // Notification Engine (Webhook + WhatsApp)
  // --------------------------------------------------------------------------
  function notifyBrother(actionName, details) {
    const timestamp = new Date().toLocaleString();
    console.log(`[Notification Sent] ${actionName}:`, details, `at ${timestamp}`);

    const payload = {
      content: `💌 **Sorry Moti Website Update!**\n**Action:** ${actionName}\n**Details:** ${details}\n**Time:** ${timestamp}`
    };

    // 1. Send to Discord Webhook if configured
    if (NOTIFICATION_CONFIG.DISCORD_WEBHOOK_URL) {
      fetch(NOTIFICATION_CONFIG.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Webhook notification failed:', err));
    }

    // 2. Send to Formspree / Custom endpoint if configured
    if (NOTIFICATION_CONFIG.FORMSPREE_ENDPOINT) {
      fetch(NOTIFICATION_CONFIG.FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionName, details: details, time: timestamp })
      }).catch(err => console.warn('Formspree notification failed:', err));
    }

    // 3. Update WhatsApp link
    updateWhatsAppLink(actionName);
  }

  function updateWhatsAppLink(action) {
    if (!whatsappNotifyLink) return;
    let message = '';
    if (action.includes('Maaf') || action.includes('forgive')) {
      message = encodeURIComponent("Bhaiyoo, maine aapki apology padh li aur aapko maaf kardiya! 🥹❤️ Ab jaldi se VIP ice-cream treat ready rakhna! 🍦✨");
    } else {
      message = encodeURIComponent("Bhaiyoo, maine abhi tak maaf nahi kiya! 😤 Aur manao mujhe! 🙈");
    }

    const phone = NOTIFICATION_CONFIG.WHATSAPP_PHONE ? NOTIFICATION_CONFIG.WHATSAPP_PHONE.replace(/[^0-9]/g, '') : '';
    const waUrl = phone 
      ? `https://wa.me/${phone}?text=${message}`
      : `https://api.whatsapp.com/send?text=${message}`;

    whatsappNotifyLink.href = waUrl;
  }

  // --------------------------------------------------------------------------
  // Web Audio Synthesizer (Zero external audio file dependency)
  // --------------------------------------------------------------------------
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playPopSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio note error:', e);
    }
  }

  function playCelebrationChime() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Pentatonic warm major notes: F5, A5, C6, E6, G6, C7
      const notes = [698.46, 880.00, 1046.50, 1318.51, 1567.98, 2093.00];

      notes.forEach((freq, idx) => {
        const startTime = ctx.currentTime + (idx * 0.08);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.92);
      });
    } catch (e) {
      console.warn('Celebration audio error:', e);
    }
  }

  // --------------------------------------------------------------------------
  // Screen Transitions Helper
  // --------------------------------------------------------------------------
  function switchScreen(fromScreen, toScreen, onComplete) {
    if (!fromScreen || !toScreen) return;

    fromScreen.style.opacity = '0';
    fromScreen.style.transform = 'translateY(-16px) scale(0.97)';

    setTimeout(() => {
      fromScreen.classList.remove('screen-active');
      fromScreen.classList.add('screen-hidden');
      fromScreen.style.opacity = '';
      fromScreen.style.transform = '';

      toScreen.classList.remove('screen-hidden');
      toScreen.classList.add('screen-active');

      toScreen.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (onComplete) onComplete();
    }, 380);
  }

  // --------------------------------------------------------------------------
  // Interactive Floating Hearts Spawner (Tap anywhere on screen)
  // --------------------------------------------------------------------------
  const HEART_EMOJIS = ['💖', '💕', '🌸', '✨', '🥺', '💗', '🥰'];

  function spawnFloatingHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'floating-click-heart';
    heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

    const dx = (Math.random() - 0.5) * 80;
    const rot = (Math.random() - 0.5) * 60;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--dx', `${dx}px`);
    heart.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, 1400);
  }

  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || e.target.closest('.sound-pill') || e.target.closest('a')) {
      return;
    }
    spawnFloatingHeart(e.clientX, e.clientY);
  });

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------

  // 1. Stage 1: "Maaf Kiya? 🥺❤️" clicked
  if (openForgiveBtn) {
    openForgiveBtn.addEventListener('click', (e) => {
      playCelebrationChime();
      notifyBrother('Maaf Kiya', 'Moti clicked [Maaf Kiya? 🥺❤️] on Opening Screen!');

      if (window.fireCelebrationConfetti) {
        window.fireCelebrationConfetti(e.clientX, e.clientY);
      }

      switchScreen(openingScreen, mainLetterScreen);
    });
  }

  // 2. Stage 1: "Abhi nahi 😤" clicked -> Sad Screen
  if (openTeaseBtn) {
    openTeaseBtn.addEventListener('click', () => {
      playPopSound();
      notifyBrother('Abhi Nahi', 'Moti clicked [Abhi nahi 😤] - Sad face screen displayed!');
      switchScreen(openingScreen, sadScreen);
    });
  }

  // 3. Stage 2 (Sad Screen): "Chalo Maaf Kiya 🥺❤️" clicked -> Main Letter
  if (sadForgiveBtn) {
    sadForgiveBtn.addEventListener('click', (e) => {
      playCelebrationChime();
      notifyBrother('Chalo Maaf Kiya', 'Moti clicked [Chalo Maaf Kiya 🥺❤️] from Sad Screen!');

      if (window.fireCelebrationConfetti) {
        window.fireCelebrationConfetti(e.clientX, e.clientY);
      }

      switchScreen(sadScreen, mainLetterScreen);
    });
  }

  // 4. Stage 2 (Sad Screen): "Thoda aur manao 🙈" tease
  if (pleadMoreBtn) {
    pleadMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playPopSound();

      pleadCount++;
      const phraseIdx = pleadCount % pleadPhrases.length;
      pleadMoreText.textContent = pleadPhrases[phraseIdx];

      sadTooltip.textContent = pleadTooltips[phraseIdx];
      sadTooltip.classList.add('show');

      pleadMoreBtn.style.transform = `scale(0.95) translate(${(Math.random() - 0.5) * 12}px, ${(Math.random() - 0.5) * 8}px)`;
      setTimeout(() => {
        pleadMoreBtn.style.transform = '';
      }, 200);

      notifyBrother('Thoda Aur Manao', `Moti is teasing! Clicked count: ${pleadCount}`);

      clearTimeout(pleadMoreBtn._timer);
      pleadMoreBtn._timer = setTimeout(() => {
        sadTooltip.classList.remove('show');
      }, 3000);
    });
  }

  // 5. Stage 3 (Main Letter): "Bhaiyoo ka Surprise Treat Dekho 🎁✨" -> Success Screen
  if (proceedCelebrationBtn) {
    proceedCelebrationBtn.addEventListener('click', (e) => {
      playCelebrationChime();
      notifyBrother('Celebration Reached', 'Moti read the whole apology and opened the VIP Surprise Treat!');

      if (window.fireCelebrationConfetti) {
        window.fireCelebrationConfetti(e.clientX, e.clientY);
      }

      switchScreen(mainLetterScreen, successScreen);
    });
  }

  // 6. Stage 4 (Success): "Read letter again 💌"
  if (readAgainBtn) {
    readAgainBtn.addEventListener('click', () => {
      playPopSound();
      switchScreen(successScreen, mainLetterScreen);
    });
  }

  // 7. Stage 4: "Send More Love 💖"
  if (moreHeartsBtn) {
    moreHeartsBtn.addEventListener('click', (e) => {
      playCelebrationChime();
      if (window.fireCelebrationConfetti) {
        window.fireCelebrationConfetti(e.clientX, e.clientY);
      }
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          spawnFloatingHeart(
            window.innerWidth / 2 + (Math.random() - 0.5) * 200,
            window.innerHeight / 2 + (Math.random() - 0.5) * 200
          );
        }, i * 70);
      }
    });
  }

  // Heart Badges click interaction
  [heartBadge1, heartBadge2].forEach(badge => {
    if (badge) {
      badge.addEventListener('click', () => {
        playPopSound();
        const rect = badge.getBoundingClientRect();
        spawnFloatingHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    }
  });

  // Sound Toggle Button
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle('muted', !soundEnabled);
      soundIcon.textContent = soundEnabled ? '🔔' : '🔕';

      if (soundEnabled) {
        playPopSound();
      }
    });

    soundToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        soundToggle.click();
      }
    });
  }

  // Initialize WhatsApp link
  updateWhatsAppLink('Maaf Kiya');

})();
