// Preloader functionality
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  preloader.classList.add('fade-out');
  
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 1000);
});

function toggleMenu() {
  const menu = document.querySelector(".navbar");
  const iconContainer = document.querySelector(".menu-icon-container");
  if (menu && iconContainer) {
    menu.classList.toggle("active");
    iconContainer.classList.toggle("active");
    document.body.style.overflow = menu.classList.contains("active") ? "hidden" : "auto";
  }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.querySelector(".navbar");
  const iconContainer = document.querySelector(".menu-icon-container");
  if (menu && iconContainer && !menu.contains(e.target) && !iconContainer.contains(e.target)) {
    menu.classList.remove("active");
    iconContainer.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    // Close mobile menu if open
    const menu = document.querySelector(".navbar");
    const iconContainer = document.querySelector(".menu-icon-container");
    if (menu.classList.contains("active")) {
      menu.classList.remove("active");
      iconContainer.classList.remove("active");
      document.body.style.overflow = "auto";
    }
    
    // Scroll to section
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Active link highlighting based on scroll position
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar a');
  
  let current = '';
  
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Scroll to top button functionality
window.addEventListener('scroll', () => {
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('active');
  } else {
    scrollTopBtn.classList.remove('active');
  }
});

// Form submission is now handled by Formspree
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    // Re-enable button after 3 seconds in case of network issues
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 3000);
  });
}

// Scroll reveal animations
document.addEventListener('DOMContentLoaded', () => {
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.service-box, .portfolio-box, .contact-card');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Initial setup - hide elements
  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'all 0.6s ease';
  });
  
  // Listen for scroll
  window.addEventListener('scroll', revealOnScroll);
  
  // Initial check in case elements are already in view
  revealOnScroll();
});
