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

  // Animate bio on load if in view
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
const username = "Volthaar"; // 🔁 Replace with your AniList username (case-sensitive)

const query = `
query {
  User(name: "${username}") {
    name
    avatar {
      large
    }
    favourites {
      anime(first: 5) {
        nodes {
          title { romaji }
          siteUrl
          coverImage { large }
        }
      }
    }
  }
  MediaListCollection(userName: "${username}", type: ANIME, status: CURRENT) {
    lists {
      entries {
        media {
          title { romaji }
          siteUrl
          coverImage { large }
        }
      }
    }
  }
}
`;

fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => {
  if (!data || !data.data) throw new Error("Invalid AniList data format");

  const user = data.data.User;
  const watching = data.data.MediaListCollection.lists.flatMap(l => l.entries);
  const favorites = user.favourites.anime.nodes;

  const avatarDiv = document.getElementById('anilist-avatar');
  const currentDiv = document.getElementById('anilist-current');
  const favoritesDiv = document.getElementById('anilist-favorites');

  // 👤 Avatar & Username
  avatarDiv.innerHTML = `
    <img src="${user.avatar.large}" alt="${user.name}" class="avatar-img" />
    <p class="username">@${user.name}</p>
  `;

  // 📺 Currently Watching
  currentDiv.innerHTML = `
    <h3>📺 Currently Watching</h3>
    <ul class="anime-list">
      ${watching.map(w => `
        <li>
          <a href="${w.media.siteUrl}" target="_blank">
            <img src="${w.media.coverImage.large}" alt="${w.media.title.romaji}" />
            <span>${w.media.title.romaji}</span>
          </a>
        </li>
      `).join('')}
    </ul>
  `;

  // 🔥 Favorites
  favoritesDiv.innerHTML = `
    <h3>🔥 Favorites</h3>
    <ul class="anime-list">
      ${favorites.map(f => `
        <li>
          <a href="${f.siteUrl}" target="_blank">
            <img src="${f.coverImage.large}" alt="${f.title.romaji}" />
            <span>${f.title.romaji}</span>
          </a>
        </li>
      `).join('')}
    </ul>
  `;
})
.catch(err => {
  console.error("AniList fetch error:", err);
});
