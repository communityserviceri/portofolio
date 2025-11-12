/* Enhanced interactions (Modern Tech Blue)
   - v10: Lightbox for Gallery Grid
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
      "IT Support Specialist — PT. Zeppelin",
      "Embedded Systems Enthusiast",
      "IoT Developer",
      "Android & Firebase"
    ];
    // Inisialisasi Dynamic Typer
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
        const staggerItems = entry.target.querySelectorAll('.reveal-item');
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
    threshold: 0.1 // Mulai tampil saat 10% elemen terlihat
  });

  // Amati semua elemen yang memiliki kelas .reveal atau .reveal-item
  document.querySelectorAll('.reveal, .reveal-item').forEach(el => {
    observer.observe(el);
  });
  //============================================

  /* Theme Toggle (Dark/Light Mode) */
  const toggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Set initial theme based on local storage or system preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.documentElement.classList.toggle('light-mode', currentTheme === 'light');
  } else if (prefersDark.matches) {
    document.documentElement.classList.remove('light-mode'); // Default Dark
  } else {
    document.documentElement.classList.add('light-mode'); // Default Light
  }

  // Listener untuk tombol toggle
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
    // Tutup menu saat link di-klik
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

  /* LIGHTBOX for Gallery Grid Baru */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption'); 
  const lbClose = document.querySelector('.close-lightbox');

  galleryItems.forEach(item => item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const title = item.getAttribute('data-title');

      lbImg.src = fullSrc;
      lbCaption.textContent = title; 
      
      // Tampilkan Lightbox
      if (lightbox) { 
          lightbox.classList.add('open'); 
          lightbox.style.display = 'flex'; 
          lightbox.setAttribute('aria-hidden','false'); 
      }
  }));

  // Tutup Lightbox via tombol 'X'
  if (lbClose) {
      lbClose.addEventListener('click', ()=> {
          if (lightbox) { 
              lightbox.classList.remove('open'); 
              // Beri sedikit jeda agar transisi CSS berjalan
              setTimeout(()=> { lightbox.style.display = 'none'; lightbox.setAttribute('aria-hidden','true'); }, 220); 
          }
      });
  }

  // Tutup Lightbox saat klik di luar gambar
  if (lightbox) {
      lightbox.addEventListener('click', (e)=> {
          if (e.target === lightbox) {
              lightbox.classList.remove('open'); 
              setTimeout(()=> lightbox.style.display = 'none', 220);
          }
      });
  }

  /* Accessibility improvement: focus outlines for keyboard users */
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus-outlines');
  });

});
