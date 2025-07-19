// Theme toggle with confetti and particles

const body = document.body;
const toggleBtn = document.getElementById('theme-toggle');
const particlesContainer = document.getElementById('particles');

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  body.classList.add('light');
  toggleBtn.classList.add('light-mode');
}

// Theme toggle handler
toggleBtn.addEventListener('click', () => {
  const isLight = body.classList.toggle('light');
  toggleBtn.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  spawnConfetti(30);
  updateParticlesColor(isLight);
});

// Confetti spawn function
function spawnConfetti(amount) {
  for (let i = 0; i < amount; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-20px';
    confetti.style.backgroundColor = getComputedStyle(body).getPropertyValue('--accent-dark').trim();
    confetti.style.animationDuration = 700 + Math.random() * 300 + 'ms';

    // Random rotation start
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    particlesContainer.appendChild(confetti);

    // Remove after animation
    confetti.addEventListener('animationend', () => confetti.remove());
  }
}

// Create floating particles in background
function createParticles(count = 50) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * window.innerWidth + 'px';
    p.style.top = Math.random() * window.innerHeight + 'px';
    p.style.animationDuration = 5000 + Math.random() * 5000 + 'ms';
    p.style.width = 4 + Math.random() * 6 + 'px';
    p.style.height = p.style.width;
    particlesContainer.appendChild(p);
  }
}
createParticles();

// Update particle colors on theme change
function updateParticlesColor(isLight) {
  document.querySelectorAll('.particle').forEach(p => {
    if (isLight) {
      p.style.backgroundColor = getComputedStyle(body).getPropertyValue('--accent-light').trim();
      p.style.filter = 'drop-shadow(0 0 2px var(--accent-light))';
    } else {
      p.style.backgroundColor = getComputedStyle(body).getPropertyValue('--accent-dark').trim();
      p.style.filter = 'drop-shadow(0 0 2px var(--accent-dark))';
    }
  });
}

// Scroll fade-in animations for bio paragraphs
const scrollElements = document.querySelectorAll('.scroll-animate');

function handleScrollAnimation() {
  scrollElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', handleScrollAnimation);
handleScrollAnimation(); // trigger on load
