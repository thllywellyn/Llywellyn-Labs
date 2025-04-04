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
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
