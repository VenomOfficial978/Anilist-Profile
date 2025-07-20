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

// Animate bio text staggered
function animateBioText() {
  const bioParagraphs = document.querySelectorAll('.bio-block p');
  bioParagraphs.forEach((p, i) => {
    setTimeout(() => {
      p.classList.add('animate');
    }, i * 300); // 300ms delay per paragraph
  });
}

// Optional: only run when bio is in view (scroll trigger)
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight * 0.85 &&
    rect.bottom >= 0
  );
}

window.addEventListener('scroll', () => {
  const bio = document.querySelector('.bio-block');
  if (bio && isElementInViewport(bio)) {
    animateBioText();
  }
});

const username = "Volthaar"; // Change to your actual AniList username

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
          title {
            romaji
          }
          siteUrl
          coverImage {
            large
          }
        }
      }
    }
  }

  MediaListCollection(userName: "${username}", type: ANIME, status: CURRENT) {
    lists {
      entries {
        media {
          title {
            romaji
          }
          siteUrl
          coverImage {
            large
          }
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
  const user = data.data.User;
  const watching = data.data.MediaListCollection.lists.flatMap(l => l.entries);
  const favorites = user.favourites.anime.nodes;

  const avatarDiv = document.getElementById('anilist-avatar');
  const currentDiv = document.getElementById('anilist-current');
  const favoritesDiv = document.getElementById('anilist-favorites');

  // Avatar
  avatarDiv.innerHTML = `
    <img src="${user.avatar.large}" alt="${user.name}" class="avatar-img"/>
    <p class="username">@${user.name}</p>
  `;

  // Currently Watching
  currentDiv.innerHTML = `
    <h3>📺 Currently Watching</h3>
    <ul class="anime-list">
      ${watching.map(w => `
        <li>
          <a href="${w.media.siteUrl}" target="_blank">
            <img src="${w.media.coverImage.large}" />
            <span>${w.media.title.romaji}</span>
          </a>
        </li>
      `).join('')}
    </ul>
  `;

  // Favorites
  favoritesDiv.innerHTML = `
    <h3>🔥 Favorites</h3>
    <ul class="anime-list">
      ${favorites.map(f => `
        <li>
          <a href="${f.siteUrl}" target="_blank">
            <img src="${f.coverImage.large}" />
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
