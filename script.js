/* ============================================================
   script.js — Portfolio interactions
   ============================================================ */

/* ── Page load intro ── */
document.body.classList.add('loading');
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.remove('loading');

    // Fade in background
    const bg = document.querySelector('.bg-layer');
    if (bg) { bg.style.transition = 'opacity 0.8s ease'; bg.style.opacity = '1'; }

    // Drop navbar
    const nav = document.querySelector('.navbar');
    if (nav) {
      nav.style.transition = 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s';
      nav.style.opacity    = '1';
      nav.style.transform  = 'translateX(-50%)';
    }

    // Reveal hero children
    document.querySelectorAll('.section--home .reveal-child').forEach((el, i) => {
      const delay = (parseInt(el.dataset.delay || i) * 120) + 600;
      setTimeout(() => el.classList.add('visible'), delay);
    });
  }, 100);
});

/* ── Scroll progress bar ── */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

/* ── Cursor glow (desktop only) ── */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  }, { passive: true });
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}

/* ── Navbar: active link on scroll ── */
const sections  = Array.from(document.querySelectorAll('section[id]'));
const navLinks  = Array.from(document.querySelectorAll('.nav-link'));

function updateNav() {
  const offset = window.innerHeight * 0.4;
  let current  = sections[0]?.id || 'home';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
  });

  navLinks.forEach(link => {
    const active = link.dataset.section === current;
    link.classList.toggle('active', active);
  });

  // Thicker blur on scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const pill = navbar.querySelector('.navbar__pill');
    if (pill) {
      pill.style.backdropFilter = window.scrollY > 40
        ? 'blur(32px)'
        : 'blur(20px)';
    }
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── IntersectionObserver: section reveal ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const children = entry.target.querySelectorAll('.reveal-child');
    children.forEach((el, i) => {
      const delay = (parseInt(el.dataset.delay || i) * 90);
      setTimeout(() => el.classList.add('visible'), delay);
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.observe-section').forEach(sec => observer.observe(sec));

/* ── Text scramble (hero title accent) ── */
const scrambleEl = document.getElementById('scrambleTarget');
if (scrambleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const original = scrambleEl.textContent;
  const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  let   frame    = 0;
  let   rafId;

  function scramble() {
    const progress = frame / 28;
    const revealed = Math.floor(progress * original.length);
    scrambleEl.textContent = original.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (i < revealed) return ch;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    frame++;
    if (frame <= 40) rafId = requestAnimationFrame(scramble);
    else scrambleEl.textContent = original;
  }

  // Trigger after hero reveal
  setTimeout(() => {
    frame = 0;
    cancelAnimationFrame(rafId);
    scramble();
  }, 900);
}

/* ── 3D tilt on project cards ── */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Particles (subtle, low density) ── */
(function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  let   particles = [];
  let   W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < 55; i++) {
    particles.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  Math.random() * 1.2 + 0.3,
      o:  Math.random() * 0.35 + 0.05
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,211,238,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
})();
