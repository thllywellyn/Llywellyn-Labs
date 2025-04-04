function toggleMenu() {
  const menu = document.querySelector(".navbar");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("active");
  icon.classList.toggle("active");
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.querySelector(".navbar");
  const icon = document.querySelector(".hamburger-icon");
  if (!menu.contains(e.target) && !icon.contains(e.target)) {
    menu.classList.remove("active");
    icon.classList.remove("active");
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
