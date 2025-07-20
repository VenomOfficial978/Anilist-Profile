// ======================
// 🌙 THEME TOGGLE BUTTON
// ======================
const toggleBtn = document.querySelector('.toggle-btn');
const body = document.body;

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('light');
  toggleBtn.classList.toggle('light-mode');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light');
    toggleBtn.classList.add('light-mode');
  }

  // Animate bio paragraphs if in viewport on load
  const bio = document.querySelector('.bio-block');
  if (bio && isElementInViewport(bio)) {
    animateBioText();
  }
});

// ======================
// 🖱️ CUSTOM CURSOR
// ======================
const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ======================
// ✨ PARTICLE ANIMATION
// ======================
const particlesContainer = document.getElementById('particles');
const particleCount = 30;

function createParticle() {
  const particle = document.createElement('div');
  particle.classList.add('particle');

  const size = Math.random() * 6 + 4;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * window.innerWidth}px`;
  particle.style.top = `${window.innerHeight + size}px`;

  const duration = Math.random() * 7 + 8;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${Math.random() * duration}s`;

  particlesContainer.appendChild(particle);

  particle.addEventListener('animationend', () => {
    particle.remove();
    createParticle();
  });
}

for (let i = 0; i < particleCount; i++) {
  createParticle();
}

// ======================
// 🚫 PREVENT TEXT SELECT OUTSIDE BIO
// ======================
document.body.addEventListener('mousedown', (e) => {
  if (!e.target.closest('.bio-block')) {
    e.preventDefault();
  }
});

// ======================
// 🎭 STAGGERED BIO ANIMATION
// ======================
function animateBioText() {
  const bioParagraphs = document.querySelectorAll('.bio-block p:not(.animate)');
  bioParagraphs.forEach((p, i) => {
    setTimeout(() => {
      p.classList.add('animate');
    }, i * 300);
  });
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0;
}

window.addEventListener('scroll', () => {
  const bio = document.querySelector('.bio-block');
  if (bio && isElementInViewport(bio)) {
    animateBioText();
  }
});

// ======================
// 🔥 AniList LIVE PROFILE DATA
// ======================
                  const username = "Volthaar"; // Case-sensitive

const query = `
query ($name: String) {
  User(name: $name) {
    name
    avatar {
      large
    }
    statistics {
      anime {
        count
        episodesWatched
        minutesWatched
      }
      manga {
        count
        chaptersRead
        volumesRead
      }
    }
  }
}
`;

fetch("https://graphql.anilist.co", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  body: JSON.stringify({
    query: query,
    variables: { name: username },
  }),
})
  .then(res => res.json())
  .then(data => {
    const user = data.data.User;

    // Avatar & Username
    document.getElementById("anilist-avatar").innerHTML = `
      <img src="${user.avatar.large}" alt="${user.name}'s Avatar">
    `;
    document.getElementById("anilist-username").textContent = user.name;

    // Anime Stats
    document.getElementById("anime-stats").innerHTML = `
      ${user.statistics.anime.count} titles<br>
      ${user.statistics.anime.episodesWatched} episodes<br>
      ${user.statistics.anime.minutesWatched} mins watched
    `;

    // Manga Stats
    document.getElementById("manga-stats").innerHTML = `
      ${user.statistics.manga.count} titles<br>
      ${user.statistics.manga.chaptersRead} chapters<br>
      ${user.statistics.manga.volumesRead} volumes read
    `;
  })
  .catch(err => {
    console.error("AniList Fetch Error:", err);
  });
