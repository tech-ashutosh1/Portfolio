/* ─────────────────────────────────────────────────────────
   PORTFOLIO MAIN SCRIPT — Enhanced
───────────────────────────────────────────────────────── */

// ── LOADING SCREEN ─────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.style.overflow = 'visible';
    initAnimations();
  }, 2000);
});
document.body.style.overflow = 'hidden';

// ── SCROLL PROGRESS BAR ─────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrolled / max) * 100) + '%';
}, { passive: true });

// ── CUSTOM CURSOR ───────────────────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
}, { passive: true });

(function animCursor() {
  tx += (mx - tx) * 0.14;
  ty += (my - ty) * 0.14;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(animCursor);
})();

// ── NAV SCROLL + ACTIVE LINK ────────────────────────────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 150) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
}, { passive: true });

// ── MOBILE MENU ─────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose= document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
});
mobileClose.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
});
document.querySelectorAll('.mob-link').forEach(a =>
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  })
);

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── THREE.JS HERO ────────────────────────────────────────
(function initThree() {
  const canvas   = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Outer icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, wireframe: true, transparent: true, opacity: 0.22 });
  const ico    = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // Inner sphere
  const sGeo  = new THREE.IcosahedronGeometry(0.9, 1);
  const sMat  = new THREE.MeshBasicMaterial({ color: 0x7B2FFF, wireframe: true, transparent: true, opacity: 0.15 });
  const inner = new THREE.Mesh(sGeo, sMat);
  scene.add(inner);

  // Outer ring
  const ringGeo = new THREE.TorusGeometry(2.4, 0.006, 2, 80);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.1 });
  const ring    = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.2;
  scene.add(ring);

  // Particle field
  const COUNT     = 900;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    positions[i*3]   = (Math.random() - 0.5) * 22;
    positions[i*3+1] = (Math.random() - 0.5) * 22;
    positions[i*3+2] = (Math.random() - 0.5) * 22;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat     = new THREE.PointsMaterial({ color: 0x00F0FF, size: 0.035, transparent: true, opacity: 0.45 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  (function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;
    ico.rotation.x   = t * 0.13 + mouseY * 0.25;
    ico.rotation.y   = t * 0.18 + mouseX * 0.25;
    inner.rotation.x = -t * 0.18;
    inner.rotation.y =  t * 0.22;
    ring.rotation.z  =  t * 0.08;
    particles.rotation.y = t * 0.025;
    particles.rotation.x = t * 0.01;
    renderer.render(scene, camera);
  })();
})();

// ── TYPED TEXT ───────────────────────────────────────────
(function initTyped() {
  const roles   = ['Backend Engineer', 'Python Developer', 'DSA Specialist', 'API Architect', 'System Builder'];
  const el      = document.getElementById('typed-text');
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) { deleting = true; setTimeout(tick, 1300); return; }
    if ( deleting && ci < 0)           { deleting = false; ri = (ri + 1) % roles.length; ci = 0; setTimeout(tick, 500); return; }
    setTimeout(tick, deleting ? 50 : 85);
  }
  setTimeout(tick, 2200);
})();

// ── GLITCH EFFECT ON HERO NAME ───────────────────────────
(function initGlitch() {
  const heroName  = document.getElementById('heroName');
  const original  = heroName.textContent;
  const chars     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  function glitch() {
    let iterations = 0;
    const interval = setInterval(() => {
      heroName.textContent = original.split('').map((c, i) =>
        i < iterations ? original[i] : (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])
      ).join('');
      if (iterations >= original.length) { clearInterval(interval); heroName.textContent = original; }
      iterations += 1.5;
    }, 35);
  }

  // Trigger periodically
  setTimeout(() => {
    glitch();
    setInterval(glitch, 8000);
  }, 5000);
})();

// ── MAGNETIC BUTTONS ─────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r    = el.getBoundingClientRect();
    const cx   = r.left + r.width  / 2;
    const cy   = r.top  + r.height / 2;
    const dx   = (e.clientX - cx) * 0.3;
    const dy   = (e.clientY - cy) * 0.3;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0,0)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
  });
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform 0.15s ease';
  });
});

// ── GSAP ANIMATIONS ──────────────────────────────────────
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero intro
  gsap.timeline()
    .to('.hero-status',  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.3)
    .to('#heroName',     { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0.6)
    .to('#heroTagline',  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.2)
    .to('#heroBtns',     { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.5)
    .to('#heroSocials',  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.7);

  // Scroll reveals (staggered)
  const groups = gsap.utils.toArray('.section-inner');
  groups.forEach(section => {
    const items = section.querySelectorAll('.reveal');
    items.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 45 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  });

  // Skills + DSA counters
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 65%',
    once: true,
    onEnter: () => {
      // Skill bars
      document.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.pct + '%';
          setTimeout(() => bar.classList.add('lit'), 1350);
        }, i * 90);
      });
      // Skill % counters
      document.querySelectorAll('.skill-pct').forEach((el, i) => {
        const target = parseInt(el.dataset.target);
        let current  = 0;
        const step = () => {
          current = Math.min(current + 2, target);
          el.textContent = current + '%';
          if (current < target) requestAnimationFrame(step);
        };
        setTimeout(step, i * 90 + 200);
      });
      // DSA stat counters
      document.querySelectorAll('.dsa-num').forEach((el, i) => {
        const target = parseInt(el.dataset.target);
        let current  = 0;
        const inc    = Math.max(1, Math.floor(target / 55));
        const step = () => {
          current = Math.min(current + inc, target);
          el.textContent = current + (target >= 100 ? '+' : '');
          if (current < target) requestAnimationFrame(step);
        };
        setTimeout(step, i * 140 + 300);
      });
    }
  });
}

// ── SKILLS RENDERING ─────────────────────────────────────
const skillGroups = [
  {
    cat: 'DSA & Core Languages',
    items: [
      { name: 'Data Structures & Algorithms', icon: '🧠', pct: 90, level: 'Expert',       violet: false },
      { name: 'C / C++',                      icon: '⚙️', pct: 85, level: 'Advanced',     violet: false },
      { name: 'Java',                          icon: '☕', pct: 82, level: 'Advanced',     violet: false },
      { name: 'Competitive Programming',       icon: '🏆', pct: 80, level: 'Advanced',     violet: false },
    ]
  },
  {
    cat: 'Backend & Frameworks',
    items: [
      { name: 'Python',          icon: '🐍', pct: 92, level: 'Expert',       violet: false },
      { name: 'Django / FastAPI',icon: '⚡', pct: 88, level: 'Expert',       violet: false },
      { name: 'REST APIs',       icon: '🔗', pct: 90, level: 'Expert',       violet: false },
    ]
  },
  {
    cat: 'Frontend & Databases',
    items: [
      { name: 'ReactJS',           icon: '⚛️', pct: 70, level: 'Intermediate', violet: true },
      { name: 'PostgreSQL / MySQL',icon: '🗃️', pct: 82, level: 'Advanced',     violet: true },
      { name: 'Git & GitHub',      icon: '🔀', pct: 85, level: 'Advanced',     violet: true },
    ]
  }
];

const sl         = document.getElementById('skills-list');
const levelClass = { Expert: 'expert', Advanced: 'advanced', Intermediate: 'intermediate' };

skillGroups.forEach(group => {
  sl.innerHTML += `<div class="skill-category-label">${group.cat}</div>`;
  group.items.forEach(s => {
    const dots  = Array.from({ length: 10 }, (_, i) =>
      `<div class="skill-dot${s.violet ? ' violet' : ''}${i < Math.round(s.pct / 10) ? ' active' : ''}"></div>`
    ).join('');
    const ticks = Array.from({ length: 9 }, () => `<div class="skill-tick"></div>`).join('');
    sl.innerHTML += `
      <div class="skill-item">
        <div class="skill-head">
          <div class="skill-name-row">
            <div class="skill-icon">${s.icon}</div>
            <span class="skill-name">${s.name}</span>
          </div>
          <div class="skill-right">
            <span class="skill-level-tag ${levelClass[s.level]}">${s.level}</span>
            <span class="skill-pct" data-target="${s.pct}">0%</span>
          </div>
        </div>
        <div class="skill-bar-wrap">
          <div class="skill-bar">
            <div class="skill-fill" data-pct="${s.pct}"></div>
            <div class="skill-ticks">${ticks}</div>
          </div>
        </div>
        <div class="skill-dots">${dots}</div>
      </div>`;
  });
});

// ── 3D CARD TILT ─────────────────────────────────────────
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.09s ease, border-color 0.3s, box-shadow 0.3s';
  });
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width;
    const y  = (e.clientY - r.top)  / r.height;
    const rx = (y - 0.5) * 18;
    const ry = (x - 0.5) * -18;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    card.style.setProperty('--mx', (x * 100) + '%');
    card.style.setProperty('--my', (y * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.7s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.3s';
    card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

// ── PROJECT CAROUSEL SCROLL CONTROLLER ──────────────────
(function initProjectCarousel() {
  const grid    = document.getElementById('projectsGrid');
  const btnPrev = document.getElementById('projPrev');
  const btnNext = document.getElementById('projNext');
  const dotsWrap= document.getElementById('projectsDots');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.card'));
  const total = cards.length;
  const CARD_W = () => cards[0].getBoundingClientRect().width + 25; // width + gap

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'projects-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dotsWrap.appendChild(dot);
  });

  function getDots() { return dotsWrap.querySelectorAll('.projects-dot'); }

  function currentIndex() {
    return Math.round(grid.scrollLeft / CARD_W());
  }

  function scrollToCard(idx) {
    idx = Math.max(0, Math.min(idx, total - 1));
    grid.scrollTo({ left: idx * CARD_W(), behavior: 'smooth' });
  }

  function updateUI() {
    const idx  = currentIndex();
    const dots = getDots();
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx >= total - 1;
  }

  btnPrev.addEventListener('click', () => scrollToCard(currentIndex() - 1));
  btnNext.addEventListener('click', () => scrollToCard(currentIndex() + 1));

  grid.addEventListener('scroll', updateUI, { passive: true });

  // Init state
  updateUI();
})();

// ── SMOOTH SCROLL WITH OFFSET ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
