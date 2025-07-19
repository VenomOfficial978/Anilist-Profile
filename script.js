// THEME TOGGLE BUTTON

const toggleBtn = document.querySelector('.toggle-btn');
const body = document.body;

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('light');
  toggleBtn.classList.toggle('light-mode');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});

// Load theme on page load from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light');
    toggleBtn.classList.add('light-mode');
  }
});

// CUSTOM CURSOR

const cursor = document.querySelector('.cursor');

window.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Particle generator

const particlesContainer = document.getElementById('particles');
const particleCount = 30;

function createParticle() {
  const particle = document.createElement('div');
  particle.classList.add('particle');

  // Random size 4-10 px
  const size = Math.random() * 6 + 4;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  // Random left position
  particle.style.left = `${Math.random() * window.innerWidth}px`;
  particle.style.top = `${window.innerHeight + size}px`;

  // Random animation duration (8-15 seconds)
  const duration = Math.random() * 7 + 8;
  particle.style.animationDuration = `${duration}s`;

  // Random animation delay (to spread start times)
  particle.style.animationDelay = `${Math.random() * duration}s`;

  particlesContainer.appendChild(particle);

  // Remove particle after animation ends and recreate for infinite loop
  particle.addEventListener('animationend', () => {
    particle.remove();
    createParticle();
  });
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
  createParticle();
}

// Prevent text selection except inside .bio-block
document.body.addEventListener('mousedown', (e) => {
  if (!e.target.closest('.bio-block')) {
    e.preventDefault();
  }
});
