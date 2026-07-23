/* ============================================================
   APEX GYM — Main JavaScript
   Animations, Interactivity, Scroll Effects
   ============================================================ */

'use strict';
emailjs.init({
    publicKey: "bhbQQjh8p-1ShD8Rh",
});
/* ---- PARTICLES ---- */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
})();

/* ---- NAVBAR SCROLL ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

/* ---- HAMBURGER MENU ---- */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
})();

/* ---- SCROLL REVEAL ---- */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ---- STATS COUNTER ---- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ---- PRICING TOGGLE ---- */
(function initPricingToggle() {
  const toggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const annualLabel = document.getElementById('annual-label');
  const priceNums = document.querySelectorAll('.price-num');
  if (!toggle) return;

  let isAnnual = false;

  function updatePrices() {
    priceNums.forEach(el => {
      const price = isAnnual ? el.dataset.annual : el.dataset.monthly;
      // Animate the price change
      el.style.transform = 'translateY(-10px)';
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = parseInt(price, 10).toLocaleString();
        el.style.transition = 'all 0.3s ease';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 200);
    });
  }

  function setToggle(annual) {
    isAnnual = annual;
    toggle.classList.toggle('active', isAnnual);
    monthlyLabel.classList.toggle('active', !isAnnual);
    annualLabel.classList.toggle('active', isAnnual);
    toggle.setAttribute('aria-checked', isAnnual.toString());
    updatePrices();
  }

  toggle.addEventListener('click', () => setToggle(!isAnnual));
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setToggle(!isAnnual);
    }
  });
  monthlyLabel.addEventListener('click', () => setToggle(false));
  annualLabel.addEventListener('click', () => setToggle(true));
})();

/* ---- TESTIMONIALS CAROUSEL ---- */
(function initCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  let currentIndex = 0;
  let autoPlayTimer;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
    resetAutoPlay();
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => goTo(currentIndex + 1), 5000);
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(currentIndex + (diff > 0 ? 1 : -1));
  });

  resetAutoPlay();
})();

/* ---- BMI CALCULATOR ---- */
(function initBMI() {
  const calcBtn = document.getElementById('calcBmiBtn');
  const bmiResult = document.getElementById('bmiResult');
  const bmiScore = document.getElementById('bmiScore');
  const bmiCategory = document.getElementById('bmiCategory');
  const bmiIndicator = document.getElementById('bmiIndicator');
  const bmiRecommendation = document.getElementById('bmiRecommendation');
  if (!calcBtn) return;

  calcBtn.addEventListener('click', () => {
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);

    if (!height || !weight || height <= 0 || weight <= 0) {
      shakeInput();
      return;
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const rounded = Math.round(bmi * 10) / 10;

    let category, recommendation, indicatorPct;

    if (bmi < 18.5) {
      category = 'UNDERWEIGHT';
      recommendation = '💪 Our Starter Plan with strength-focused programs can help you build healthy muscle mass. Consider our nutrition coaching to create a caloric surplus plan.';
      indicatorPct = Math.max(2, (bmi / 18.5) * 25);
    } else if (bmi < 25) {
      category = 'NORMAL WEIGHT';
      recommendation = '✅ Great work! Our Elite Plan is perfect for you — maintain your physique, build muscle, and improve overall athletic performance.';
      indicatorPct = 25 + ((bmi - 18.5) / 6.5) * 30;
    } else if (bmi < 30) {
      category = 'OVERWEIGHT';
      recommendation = '⚡ Our HIIT + Nutrition package will help you effectively. The Elite Plan includes unlimited classes and nutrition coaching to get you back to your ideal range fast.';
      indicatorPct = 55 + ((bmi - 25) / 5) * 25;
    } else {
      category = 'OBESE';
      recommendation = '🔥 Our APEX PRO plan with dedicated personal training and nutritionist support is designed for transformative results. Our coaches specialize in sustainable weight management.';
      indicatorPct = Math.min(98, 80 + ((bmi - 30) / 10) * 18);
    }

    bmiResult.style.display = 'block';
    bmiScore.textContent = rounded;
    bmiCategory.textContent = category;
    bmiIndicator.style.left = `${indicatorPct}%`;
    bmiRecommendation.textContent = recommendation;

    bmiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function shakeInput() {
    const calc = document.querySelector('.bmi-calculator');
    calc.style.animation = 'none';
    calc.offsetHeight; // trigger reflow
    calc.style.animation = 'shake 0.5s ease';
  }
})();

/* ---- CONTACT FORM ---- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    if (!name || !email) return;

    const submitBtn = document.getElementById('contact-submit-btn');
    submitBtn.textContent = 'Sending...';
   submitBtn.innerHTML = "Message Sent ✓";
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.style.display = 'flex';
      successMsg.style.alignItems = 'center';
      successMsg.style.justifyContent = 'center';
      successMsg.style.gap = '12px';
      successMsg.style.fontSize = '1.1rem';
      successMsg.style.padding = '32px';
    }, 1200);
  });
})();

/* ---- NEWSLETTER ---- */
(function initNewsletter() {
  const btn = document.getElementById('newsletter-submit-btn');
  const input = document.getElementById('newsletter-email');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email || !email.includes('@')) return;
    btn.textContent = '✓';
    btn.style.background = '#34C759';
    btn.style.pointerEvents = 'none';
    input.value = '';
    input.placeholder = 'Subscribed! 🎉';
  });
})();

/* ---- BACK TO TOP ---- */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---- SHAKE ANIMATION FOR BMI ---- */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);

/* ---- CURSOR GLOW EFFECT (DESKTOP ONLY) ---- */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip mobile

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    background: radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    opacity: 0;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    raf = requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();

/* ---- PAGE LOAD ANIMATION ---- */
(function initPageLoad() {
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });
})();
// =========================
// EMAILJS CONTACT FORM
// =========================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById("contact-submit-btn");
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";

        emailjs.sendForm(
            "service_a7byl3i",
            "template_gw5nyb8",
            this
        )
        .then(() => {
            submitBtn.innerHTML = "Message Sent ✓";
            document.getElementById("formSuccess").style.display = "block";
            contactForm.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Send Message";
               submitBtn.innerHTML = "Message Sent ✓";
            }, 3000);
        })
        .catch((error) => {
            console.error(error);
            alert("Something went wrong. Please try again.");

            submitBtn.disabled = false;
            submitBtn.innerHTML = "Send Message";
           submitBtn.innerHTML = "Message Sent ✓";
        });
    });
}

console.log('%c⚡ APEX GYM', 'color: #FF6B00; font-family: sans-serif; font-size: 24px; font-weight: bold; letter-spacing: 3px;');
console.log('%cWhere legends are forged.', 'color: #888; font-family: sans-serif; font-size: 12px;');
