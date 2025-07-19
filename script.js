// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.add('light');
    themeToggle.classList.add('light-mode');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    themeToggle.classList.toggle('light-mode');
    const theme = body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);

    // Confetti effect on toggle
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${themeToggle.offsetLeft + Math.random() * themeToggle.offsetWidth}px`;
      confetti.style.top = `${themeToggle.offsetTop}px`;
      confetti.style.backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1100);
    }
  });

  // Particle system
  const particlesContainer = document.getElementById('particles');
  const numParticles = 40;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = random(6, 14);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${random(0, 100)}vw`;
    particle.style.top = `${random(100, 120)}vh`;
    particle.style.animationDuration = `${random(8, 15)}s`;
    particle.style.animationDelay = `${random(0, 15)}s`;
    particlesContainer.appendChild(particle);
  }

  // Scroll animations
  const scrollElements = document.querySelectorAll('.scroll-animate');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  scrollElements.forEach((el) => observer.observe(el));

  // Parallax effect
  const parallaxTop = document.getElementById('parallax-top');
  const parallaxBottom = document.getElementById('parallax-bottom');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxTop.style.transform = `translateY(${scrollY * 0.3}px)`;
    parallaxBottom.style.transform = `translateY(${-scrollY * 0.2}px)`;
  });

  // Chatbot simple logic
  const chatbot = document.getElementById('chatbot');
  const messages = chatbot.querySelector('.messages');
  const input = chatbot.querySelector('#chat-input');

  const botReplies = [
    "Hey there! How can I echo your thoughts today?",
    "Silence is loud sometimes, huh?",
    "If you want to talk, I'm here... kinda.",
    "Remember: even the darkest nights end with dawn.",
    "You’re not alone. Even if it feels like it.",
  ];

  function addMessage(text, isUser = false) {
    const p = document.createElement('p');
    p.textContent = text;
    if (isUser) p.style.fontWeight = 'bold';
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      const userText = input.value.trim();
      addMessage(userText, true);
      input.value = '';
      setTimeout(() => {
        const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
        addMessage(reply);
      }, 900);
    }
  });
});
