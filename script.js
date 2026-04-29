'use strict';

/* =============================================
   DIFRIOS — script.js
   ============================================= */

// ── 1. SCROLL PROGRESS BAR ──────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.style.cssText = `
  position:fixed;top:0;left:0;width:0%;height:3px;
  background:linear-gradient(90deg,#0081C6,#5CB8E4);
  z-index:10000;transition:width .1s linear;pointer-events:none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });


// ── 2. HEADER SOMBRA NO SCROLL ──────────────────
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });


// ── 3. HAMBURGER MENU ───────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileNav');
const overlay    = document.getElementById('overlay');

function openMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  if (overlay) overlay.classList.add('show');
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (overlay) overlay.classList.remove('show');
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

if (overlay) overlay.addEventListener('click', closeMenu);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
    hamburger.focus();
  }
});


// ── 4. NAV — LINK ATIVO NO SCROLL ───────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

const highlightNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('ativo', a.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();


// ── 5. EFFECT DE DIGITAÇÃO — HERO SUBTÍTULO ─────
const typeTarget = document.querySelector('.hero-subtitle');
if (typeTarget) {
  const original = typeTarget.textContent.trim();
  typeTarget.textContent = '';
  typeTarget.style.borderRight = '2px solid rgba(255,255,255,0.7)';
  typeTarget.style.whiteSpace = 'nowrap';
  typeTarget.style.overflow = 'hidden';
  typeTarget.style.display = 'inline-block';

  let i = 0;
  const speed = 45;

  function type() {
    if (i < original.length) {
      typeTarget.textContent += original.charAt(i++);
      setTimeout(type, speed);
    } else {
      setTimeout(() => {
        typeTarget.style.borderRight = 'none';
      }, 800);
    }
  }

  setTimeout(type, 1000);
}


// ── 6. COUNTERS ANIMADOS ─────────────────────────
const animateCounter = (el) => {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  const step = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };

  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));


// ── 7. RIPPLE NOS BOTÕES ─────────────────────────
document.querySelectorAll('.btn, .btn-hero, .btn-contato, .btn-wpp').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect   = this.getBoundingClientRect();
    const circle = document.createElement('span');
    const size   = Math.max(rect.width, rect.height);

    circle.className = 'ripple';
    circle.style.cssText = `
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top  - size / 2}px;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 700);
  });
});




// ── 9. REVEAL NO SCROLL (IntersectionObserver) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      setTimeout(() => el.classList.add('visible'), 60);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.produto-card, .dif-card, .cliente-card, ' +
  '.sobre-texto, .mvv-card, ' +
  '.contato-card, .contato-slogan-card, ' +
  '.section-tag, .section-title, .section-desc'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});


// ── 10. SMOOTH SCROLL ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = document.querySelector('.header')?.offsetHeight || 72;
    const top     = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ── 11. HERO H1 LINHA ANIMADA ───────────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-title .linha-animada').forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), 400 + i * 200);
  });
});


// ── 12. CURSOR GLOW EFFECT ──────────────────────
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
cursorGlow.style.cssText = `
  position: fixed;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0, 129, 198, 0.6);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 0 15px rgba(0, 129, 198, 0.4), inset 0 0 15px rgba(0, 129, 198, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = (e.clientX - 15) + 'px';
  cursorGlow.style.top = (e.clientY - 15) + 'px';
  cursorGlow.style.opacity = '1';
}, { passive: true });

document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
}, { passive: true });


// ── 13. EFEITO PARALLAX SUAVE NO SCROLL ────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = el.dataset.parallax || 0.5;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });


// ── 14. ANIMAÇÃO DE ENTRADA NOS CARDS ──────────
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `slideInCard 0.6s ease-out forwards`;
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.produto-card, .cliente-card, .dif-card').forEach((card, i) => {
  card.style.animationDelay = (i * 0.08) + 's';
  cardObserver.observe(card);
});


// ── 15. EFEITO DE GLOW NOS BOTÕES AO HOVER ─────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.style.setProperty('--mouse-x', x + 'px');
    this.style.setProperty('--mouse-y', y + 'px');
  });

  btn.addEventListener('mouseleave', function() {
    this.style.removeProperty('--mouse-x');
    this.style.removeProperty('--mouse-y');
  });
});


// ── 16. NÚMERO ANIMADO AO ENTRAR NA VIEWPORT ──
const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      const target = parseInt(entry.target.dataset.target, 10);
      const duration = 1.5;
      const start = performance.now();

      const animate = (now) => {
        const elapsed = (now - start) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const easeValue = 1 - Math.pow(1 - progress, 3);

        entry.target.textContent = Math.floor(easeValue * target);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => numberObserver.observe(el));


// ── 17. TRANSIÇÃO SUAVE ENTRE SEÇÕES ───────────
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(10px)';
  section.style.transition = 'all 0.8s ease-out';
  sectionObserver.observe(section);
});


// ── 18. EFEITO DE PULSAÇÃO NOS ÍCONES ───────────
const createPulseEffect = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInCard {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 10px rgba(0, 129, 198, 0.4),
                    0 0 20px rgba(0, 129, 198, 0.2);
      }
      50% {
        box-shadow: 0 0 20px rgba(0, 129, 198, 0.8),
                    0 0 40px rgba(0, 129, 198, 0.4);
      }
    }
  `;
  document.head.appendChild(style);
};

createPulseEffect();


// ── 19. HOVER EFFECT NOS CARDS COM SOMBRA ──────
document.querySelectorAll('.contato-card, .contato-slogan-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.boxShadow = '0 20px 60px rgba(0, 129, 198, 0.25)';
    this.style.transform = 'translateY(-8px)';
  });

  card.addEventListener('mouseleave', function() {
    this.style.boxShadow = '';
    this.style.transform = '';
  });
});


// ── 20. ANIMAÇÃO AO CARREGAR A PÁGINA ────────────
window.addEventListener('load', () => {
  document.body.style.animation = 'fadeInBody 0.8s ease-out';
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInBody {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
});
