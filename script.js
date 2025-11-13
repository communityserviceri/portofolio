/* Enhanced interactions (Modern Tech Blue)
   - v9: Dual Observer (Fade-in + Stagger)
   - v7: Update selector IO
   - v6: Stability Fix
   - v5: Dynamic Looping Typer
*/
document.addEventListener('DOMContentLoaded', () => {

  /* Deteksi Dukungan Animasi */
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-animations-active');
  }

  /* Dynamic Looping Typer */
  const subtitleEl = document.getElementById('typing-subtitle');
  if (subtitleEl) {
    const roles = [
      "IT Support Specialist — Zeppelin",
      "Embedded Systems Enthusiast",
      "IoT Developer",
      "Android & Firebase"
    ];
    new DynamicTyper(subtitleEl, roles);
  }

  function DynamicTyper(element, roles, typeSpeed = 70, deleteSpeed = 50, pause = 1500) {
    this.element = element;
    this.roles = roles;
    this.typeSpeed = typeSpeed;
    this.deleteSpeed = deleteSpeed;
    this.pause = pause;
    this.loopIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    this._tick = () => {
      const i = this.loopIndex % this.roles.length;
      const fullText = this.roles[i];
      let delay = this.typeSpeed;

      if (this.isDeleting) {
        this.element.innerHTML = fullText.substring(0, this.charIndex - 1);
        this.charIndex--;
        delay = this.deleteSpeed;
      } else {
        this.element.innerHTML = fullText.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      if (!this.isDeleting && this.charIndex === fullText.length) {
        delay = this.pause;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.loopIndex++;
        delay = 500; 
      }
      setTimeout(this._tick, delay);
    };
    setTimeout(this._tick, 1000); 
  }
  
  /* Mobile Menu Toggle */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const nav = document.querySelector('#main-header nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      icon.className = nav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          menuToggle.querySelector('i').className = 'fas fa-bars';
        }
      });
    });
  }

  /* PAGE FADE ON LOAD -> fade out overlay */
  const pageFade = document.querySelector('.page-fade-overlay');
  if (pageFade) {
    pageFade.style.background = getComputedStyle(document.documentElement).getPropertyValue('--page-fade') || 'transparent';
    pageFade.style.opacity = '1';
    setTimeout(()=> pageFade.style.transition = 'opacity .6s ease', 10);
    setTimeout(()=> pageFade.style.opacity = '0', 60);
    setTimeout(()=> pageFade.style.pointerEvents = 'none', 700);
  }

  /* Header shadow & Scroll Animations */
  const header = document.getElementById('main-header');
  const bg = document.querySelector('.background-overlay');
  const heroRight = document.querySelector('.hero-right'); 
  const isMobile = window.matchMedia("(max-width: 900px)").matches; 

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 36) {
      header.style.boxShadow = '0 12px 40px rgba(0,0,0,0.45)';
      header.style.backdropFilter = 'blur(10px)';
    } else {
      header.style.boxShadow = '';
      header.style.backdropFilter = 'blur(8px)';
    }
    if (bg) bg.style.transform = `translateY(${scrollY * 0.08}px)`;
    if (heroRight && !isMobile) {
      const opacity = Math.max(0, 1 - (scrollY / 300)); 
      const transform = `translateY(${scrollY * -0.15}px)`; 
      heroRight.style.opacity = opacity;
      heroRight.style.transform = transform;
    }
  });

  /* SMOOTH NAV: support cross-page anchor scrolling gracefully */
  document.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
      if (a.closest('nav.open')) { /* Biarkan logika menu toggle */ }

      const isSamePageAnchor = href.startsWith('#') || (href.includes(location.pathname) && href.includes('#'));
      if (isSamePageAnchor && href.length > 1) { 
        e.preventDefault();
        const id = href.split('#')[1];
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({behavior:'smooth'});
        else location.href = href;
      } else if (!isSamePageAnchor && href.length > 0) {
        e.preventDefault();
        const overlay = document.querySelector('.page-fade-overlay');
        if (overlay) {
          overlay.style.pointerEvents = 'auto';
          overlay.style.background = getComputedStyle(document.documentElement).getPropertyValue('--page-fade') || 'rgba(19,18,28,0.85)';
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity .45s ease';
          requestAnimationFrame(()=> overlay.style.opacity = '1');
          setTimeout(()=> window.location.href = href, 520);
        } else {
          window.location.href = href;
        }
      }
    });
  });

  /* =========================
     Sistem Animasi v9
     ========================= */
  if (document.body.classList.contains('js-animations-active')) {
    
    // 1. Observer untuk Stagger (Beruntun)
    const staggerContainers = document.querySelectorAll('.reveal');
    const staggerObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('.reveal-item, .card, .skill, .timeline-card, .contact-card');
          if (children.length) {
            children.forEach((c, i) => {
              setTimeout(() => {
                if (c.classList) { 
                  c.classList.add('active');
                }
              }, i * 100); // Jeda 100ms
            });
          }
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.1, rootMargin:'0px 0px -50px 0px'}); 
    
    staggerContainers.forEach(r => staggerObserver.observe(r));

    // 2. Observer untuk Fade-in Sederhana
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
    const fadeObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    fadeElements.forEach(el => fadeObserver.observe(el));
  }
  /* ========================= */


  /* FLOATING TITLE micro-parallax (LEBIH HALUS) */
  const floating = document.querySelector('.floating-title');
  if (floating) {
    document.addEventListener('mousemove', (ev) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (ev.clientX - cx) / cx;
      const dy = (ev.clientY - cy) / cy;
      floating.style.transform = `translate3d(${dx * 3}px, ${dy * 2}px, 0)`;
    });
  }

  /* TILT 3D - mouse follow effect (LEBIH HALUS) */
  const tiltItems = document.querySelectorAll('.tilt-3d');
  tiltItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const rotateX = (dy * 4).toFixed(2); 
      const rotateY = (dx * -4).toFixed(2); 
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
    });
    item.addEventListener('mouseleave', ()=> {
      item.style.transform = '';
    });
  });

  /* THEME BLEND: smooth transition of key CSS variables */
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme === 'light') {
    root.classList.add('light-mode');
    themeBtn.querySelector('i').className = 'fas fa-sun'; 
  } else {
    themeBtn.querySelector('i').className = 'fas fa-moon'; 
  }

  function blendToLight(enable) {
    if (enable) root.classList.add('light-mode');
    else root.classList.remove('light-mode');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', enable ? '#f7f8fb' : '#1a1e2c');
    localStorage.setItem('site-theme', enable ? 'light' : 'dark');
    const overlay = document.querySelector('.page-fade-overlay');
    if (overlay) {
      overlay.style.pointerEvents = 'auto';
      overlay.style.background = getComputedStyle(document.documentElement).getPropertyValue('--page-fade') || (enable ? 'rgba(255,255,255,0.95)' : 'rgba(19,18,28,0.85)');
      overlay.style.transition = 'opacity .45s ease';
      overlay.style.opacity = '0';
      requestAnimationFrame(()=> overlay.style.opacity = '1');
      setTimeout(()=> overlay.style.opacity = '0', 260);
      setTimeout(()=> overlay.style.pointerEvents = 'none', 700);
    }
  }

  themeBtn && themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light-mode');
    const icon = themeBtn.querySelector('i');
    icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    blendToLight(isLight);
  });

  /* CAROUSEL (gallery) */
  const carousel = document.getElementById('gallery-carousel'); 
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');
    let idx = 0;
    const goTo = (i) => {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
    };
    prev.addEventListener('click', ()=> goTo(idx - 1));
    next.addEventListener('click', ()=> goTo(idx + 1));
    let autoplay = setInterval(()=> goTo(idx + 1), 3800);
    carousel.addEventListener('mouseenter', ()=> clearInterval(autoplay));
    carousel.addEventListener('mouseleave', ()=> autoplay = setInterval(()=> goTo(idx + 1), 3800));
  }

  /* LIGHTBOX */
  const thumbs = document.querySelectorAll('.thumb');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.querySelector('.close-lightbox');

  thumbs.forEach(t => t.addEventListener('click', () => {
    lbImg.src = t.src;
    if (lightbox) { lightbox.classList.add('open'); lightbox.style.display = 'flex'; lightbox.setAttribute('aria-hidden','false'); }
  }));
  lbClose && lbClose.addEventListener('click', ()=> {
    if (lightbox) { lightbox.classList.remove('open'); setTimeout(()=> { lightbox.style.display = 'none'; lightbox.setAttribute('aria-hidden','true'); }, 220); }
  });
  lightbox && lightbox.addEventListener('click', (e)=> {
    if (e.target === lightbox) {
      lightbox.classList.remove('open'); setTimeout(()=> lightbox.style.display = 'none', 220);
    }
  });

  /* Accessibility improvement: focus outlines for keyboard users */
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus-outlines');
  });

  /* Small performance: lazyload images (native) */
  document.querySelectorAll('img').forEach(img => {
    if (!img.getAttribute('loading')) img.setAttribute('loading','lazy');
  });


});

/* =========================
   Particle Network Animation
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        // Sesuaikan warna partikel dengan tema Anda
        const particleColor = 'rgba(0, 169, 255, 0.7)'; // --color-mauve
        const linkColor = 'rgba(56, 189, 248, 0.3)'; // --color-accent

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles(); // Buat ulang partikel saat resize
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }

            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }

            draw() {
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function createParticles() {
            particles = [];
            let particleCount = (canvas.width * canvas.height) / 10000;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = linkColor;
                        ctx.lineWidth = 0.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Panggil sekali di awal
        animate();
    }
});
