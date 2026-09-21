/**
 * Sorry Moti ❤️ - Background Canvas & Celebration Confetti Engine
 * Lightweight, high-performance canvas engine with zero external dependencies.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Background floating particles & hearts
  const bgParticles = [];
  const BG_PARTICLE_COUNT = window.innerWidth < 768 ? 24 : 45;

  // Celebration active particles
  let celebrationParticles = [];
  let isCelebrationActive = false;

  // Color palette for hearts & confetti
  const HEART_COLORS = [
    'rgba(255, 105, 140, 0.45)',
    'rgba(255, 51, 102, 0.35)',
    'rgba(255, 182, 193, 0.55)',
    'rgba(255, 133, 162, 0.4)',
    'rgba(216, 27, 96, 0.3)',
    'rgba(255, 195, 209, 0.5)'
  ];

  const CELEBRATION_COLORS = [
    '#ff3366', '#ff5e85', '#ff85a2', '#ffb703',
    '#fb8500', '#ffd1dc', '#fff0f5', '#9d4edd',
    '#06d6a0', '#ffccd5'
  ];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  // Helper to draw a crisp heart on 2D canvas
  function drawHeart(c, x, y, size, color, rotation) {
    c.save();
    c.translate(x, y);
    if (rotation) c.rotate(rotation);
    c.fillStyle = color;
    c.beginPath();

    const topCurveHeight = size * 0.3;
    c.moveTo(0, topCurveHeight);
    // top left curve
    c.bezierCurveTo(
      -size / 2, -topCurveHeight,
      -size, size / 3,
      0, size
    );
    // top right curve
    c.bezierCurveTo(
      size, size / 3,
      size / 2, -topCurveHeight,
      0, topCurveHeight
    );
    c.closePath();
    c.fill();
    c.restore();
  }

  // Helper to draw star/sparkle
  function drawStar(c, x, y, size, color, rotation) {
    c.save();
    c.translate(x, y);
    if (rotation) c.rotate(rotation);
    c.fillStyle = color;
    c.beginPath();
    for (let i = 0; i < 4; i++) {
      c.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
      c.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3));
    }
    c.closePath();
    c.fill();
    c.restore();
  }

  // Background floating ambient particles
  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = 7 + Math.random() * 16;
      this.speedY = 0.3 + Math.random() * 0.7;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      this.type = Math.random() > 0.3 ? 'heart' : 'sparkle';
      this.rotation = (Math.random() - 0.5) * 0.5;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
      this.opacity = 0.2 + Math.random() * 0.6;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.01 + Math.random() * 0.02;
    }

    update() {
      this.sway += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.sway) * 0.4;
      this.y -= this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y < -30 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.globalAlpha = this.opacity;
      if (this.type === 'heart') {
        drawHeart(ctx, this.x, this.y, this.size, this.color, this.rotation);
      } else {
        drawStar(ctx, this.x, this.y, this.size * 0.6, this.color, this.rotation);
      }
      ctx.globalAlpha = 1.0;
    }
  }

  // Celebration confetti particle
  class CelebrationParticle {
    constructor(originX, originY) {
      this.x = originX;
      this.y = originY;
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 16;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 6; // upward bias
      this.gravity = 0.28 + Math.random() * 0.15;
      this.friction = 0.96;
      this.size = 8 + Math.random() * 14;
      this.color = CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)];
      this.shape = ['heart', 'circle', 'ribbon', 'star'][Math.floor(Math.random() * 4)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.2;
      this.opacity = 1;
      this.life = 1;
      this.decay = 0.006 + Math.random() * 0.009;
    }

    update() {
      this.vx *= this.friction;
      this.vy = this.vy * this.friction + this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.life -= this.decay;
      this.opacity = Math.max(0, this.life);
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;

      if (this.shape === 'heart') {
        drawHeart(ctx, this.x, this.y, this.size, this.color, this.rotation);
      } else if (this.shape === 'circle') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === 'star') {
        drawStar(ctx, this.x, this.y, this.size * 0.7, this.color, this.rotation);
      } else {
        // Ribbon / rectangle
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size * 0.6, -this.size * 0.25, this.size * 1.2, this.size * 0.5);
      }

      ctx.restore();
    }
  }

  // Initialize background particles
  function init() {
    resizeCanvas();
    if (!prefersReducedMotion) {
      for (let i = 0; i < BG_PARTICLE_COUNT; i++) {
        bgParticles.push(new AmbientParticle());
      }
    }
    requestAnimationFrame(renderLoop);
  }

  // Animation Loop
  function renderLoop() {
    ctx.clearRect(0, 0, width, height);

    // Render ambient floating background
    if (!prefersReducedMotion) {
      for (let i = 0; i < bgParticles.length; i++) {
        bgParticles[i].update();
        bgParticles[i].draw();
      }
    }

    // Render celebration confetti
    if (celebrationParticles.length > 0) {
      for (let i = celebrationParticles.length - 1; i >= 0; i--) {
        const p = celebrationParticles[i];
        p.update();
        p.draw();
        if (p.life <= 0 || p.y > height + 50) {
          celebrationParticles.splice(i, 1);
        }
      }
    }

    requestAnimationFrame(renderLoop);
  }

  // Trigger celebration explosion
  window.fireCelebrationConfetti = function (customX, customY) {
    const originX = customX || width / 2;
    const originY = customY || height * 0.45;
    const count = window.innerWidth < 768 ? 90 : 160;

    for (let i = 0; i < count; i++) {
      celebrationParticles.push(new CelebrationParticle(originX, originY));
    }

    // Secondary side bursts after a small delay for dramatic celebration
    setTimeout(() => {
      for (let i = 0; i < count * 0.4; i++) {
        celebrationParticles.push(new CelebrationParticle(width * 0.2, height * 0.6));
        celebrationParticles.push(new CelebrationParticle(width * 0.8, height * 0.6));
      }
    }, 280);

    setTimeout(() => {
      for (let i = 0; i < count * 0.3; i++) {
        celebrationParticles.push(new CelebrationParticle(width * 0.5, height * 0.3));
      }
    }, 600);
  };

  // Handle Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  });

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
