// TecFix - Scripts de interactividad

// Crear partículas animadas
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);

  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posición aleatoria
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Tamaño aleatorio
    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Delay aleatorio para la animación
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    particlesContainer.appendChild(particle);
  }
}

// Crear líneas tecnológicas animadas
function createTechLines() {
  const linesContainer = document.createElement('div');
  linesContainer.className = 'tech-lines';
  document.body.appendChild(linesContainer);

  const lineCount = 5;
  
  for (let i = 0; i < lineCount; i++) {
    const line = document.createElement('div');
    line.className = 'tech-line';
    
    // Posición horizontal aleatoria
    line.style.left = Math.random() * 100 + '%';
    
    // Delay aleatorio
    line.style.animationDelay = Math.random() * 8 + 's';
    line.style.animationDuration = (Math.random() * 4 + 6) + 's';
    
    // Altura aleatoria
    const height = Math.random() * 100 + 50;
    line.style.height = height + 'px';
    
    linesContainer.appendChild(line);
  }
}

// Efecto de scroll reveal
function initScrollReveal() {
  const reveals = document.querySelectorAll('.service-card, .feature-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    reveal.classList.add('reveal');
    observer.observe(reveal);
  });
}

// Efecto parallax sutil en el hero
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  });
}

// Efecto de typing en el logo (opcional)
function initLogoGlow() {
  const logo = document.querySelector('.logo');
  if (!logo) return;

  setInterval(() => {
    logo.style.textShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
    setTimeout(() => {
      logo.style.textShadow = '0 0 20px rgba(59, 130, 246, 0.8)';
    }, 500);
  }, 2000);
}

// Smooth scroll para enlaces internos
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Efecto de cursor tech (opcional, solo en desktop)
function initTechCursor() {
  if (window.innerWidth < 768) return; // Solo en desktop

  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(59, 130, 246, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    display: none;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.display = 'block';
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
  });

  // Efecto al pasar sobre elementos interactivos
  const interactiveElements = document.querySelectorAll('a, button, .service-card, .feature-item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(1.5)';
      cursor.style.borderColor = 'rgba(59, 130, 246, 0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    });
  });
}

// Animación de contadores en estadísticas
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateValue(entry.target, 0, target, 2000);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    element.textContent = current;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}

// FAQ interactivo
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Cerrar todos los demás items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle del item actual
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  createTechLines();
  initScrollReveal();
  initParallax();
  initLogoGlow();
  initSmoothScroll();
  initTechCursor();
  animateCounters();
  initFAQ();
});

// Recrear partículas al redimensionar (opcional)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Las partículas se ajustan automáticamente
  }, 250);
});

