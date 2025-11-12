/* Enhanced interactions (Modern Tech Blue)
   - FIX: Dual Observer (Fade-in + Stagger) to prevent blank page
   - FIX: Restore Carousel Logic for gallery.html
   - FIX: Dynamic Looping Typer Logic
   - ADD: Lightbox for Gallery with Title
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
      "IT Support Specialist — PT. Zeppelin",
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
        this.charIndex = Math.max(0, this.charIndex - 1);
        delay = this.deleteSpeed;
      } else {
        this.charIndex = Math.min(fullText.length, this.charIndex + 1);
        delay = this.typeSpeed;
      }

      this.element.innerHTML = fullText.substring(0, this.charIndex);

      if (!this.isDeleting && this.charIndex === fullText.length) {
        this.isDeleting = true;
        delay = this.pause;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.loopIndex++;
        delay = 500; // Pause before starting next role
      }

      setTimeout(() => this._tick(), delay);
    };
    this._tick();
  }


  /* Intersection Observer for Fade-in (Staggered Reveal) */
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Tambahkan kelas 'active' pada elemen utama
        entry.target.classList.add('active'); 
        
        // Cek jika elemen memiliki children dengan kelas reveal-item (untuk stagger)
        const staggerItems = entry.target.querySelectorAll('.reveal-item, .card, .skill, .timeline-card, .contact-card');
        if (staggerItems.length > 0) {
            staggerItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('active');
                }, index * 120); // Delay 120ms per item
            });
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px',
    threshold: 0.1
  });

  // Amati semua elemen yang memiliki kelas .reveal
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
  //============================================

  /* Theme Toggle (Dark/Light Mode) */
  const toggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.documentElement.classList.toggle('light-mode', currentTheme === 'light');
  } else if (prefersDark.matches) {
    document.documentElement.classList.remove('light-mode');
  } else {
    document.documentElement.classList.add('light-mode');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-mode');
      const theme = document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
    });
  }


  /* Mobile Menu Toggle */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const nav = document.querySelector('#main-header nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.querySelector('i').classList.toggle('fa-bars');
      menuToggle.querySelector('i').classList.toggle('fa-times');
    });
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });
  }

  /* ==================================================
     FUNGSI CAROUSEL (DIPERLUKAN UNTUK GALLERY.HTML)
     ================================================== */
  const carousel = document.querySelector('.gallery-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const totalSlides = slides.length;
    let idx = 0;

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${-idx * 100}%)`;
        slide.classList.toggle('active', index === idx);
      });
    };

    const goTo = (newIndex) => {
      idx = (newIndex + totalSlides) % totalSlides;
      updateSlides();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(idx + 1));

    // Autoplay logic
    let autoplay = setInterval(() => goTo(idx + 1), 3800);
    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', () => autoplay = setInterval(() => goTo(idx + 1), 3800));
  }

  /* LIGHTBOX (Diperbarui untuk mendukung data-title) */
  const thumbs = document.querySelectorAll('.thumb, .gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.querySelector('.close-lightbox');
  const lbCaption = document.getElementById('lightbox-caption'); 

  thumbs.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    // Ambil data-full, jika tidak ada, gunakan src dari img di dalamnya.
    const imgSrc = t.getAttribute('data-full') || (t.querySelector('img') ? t.querySelector('img').src : t.src);
    // Ambil judul dari data-title
    const imgCaption = t.getAttribute('data-title') || 'Sertifikat';
    
    lbImg.src = imgSrc;
    if(lbCaption) lbCaption.textContent = imgCaption;

    if (lightbox) { 
      lightbox.classList.add('open'); 
      lightbox.style.display = 'flex'; 
      lightbox.setAttribute('aria-hidden','false'); 
    }
  }));

  if (lbClose) {
    lbClose.addEventListener('click', ()=> {
      if (lightbox) { 
        lightbox.classList.remove('open'); 
        setTimeout(()=> { lightbox.style.display = 'none'; lightbox.setAttribute('aria-hidden','true'); }, 220); 
      }
    });
  }
  
  if (lightbox) {
    lightbox.addEventListener('click', (e)=> {
      if (e.target === lightbox) {
        lightbox.classList.remove('open'); setTimeout(()=> lightbox.style.display = 'none', 220);
      }
    });
  }

  /* Accessibility improvement: focus outlines for keyboard users */
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus-outlines');
  });

});
