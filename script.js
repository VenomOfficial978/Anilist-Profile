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
    User(name: "Volthaar") {
      name
      avatar {
        large
      }
      favourites {
        anime {
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
    MediaListCollection(userName: "Volthaar", type: ANIME, status: CURRENT) {
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

fetch("https://graphql.anilist.co", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  body: JSON.stringify({ query }),
})
  .then((response) => response.json())
  .then((data) => {
    const user = data.data.User;
    const mediaList = data.data.MediaListCollection.lists;

    // Set name and avatar
    document.querySelector(".username").textContent = user.name;
    document.querySelector(".pfp").src = user.avatar.large;

    // Display top 5 favorites
    const favoritesContainer = document.querySelector(".favorites");
    const topFavorites = user.favourites.anime.nodes.slice(0, 5);

    topFavorites.forEach((anime) => {
      const favElement = document.createElement("a");
      favElement.href = anime.siteUrl;
      favElement.target = "_blank";
      favElement.innerHTML = `
        <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" class="anime-cover" />
        <span>${anime.title.romaji}</span>
      `;
      favoritesContainer.appendChild(favElement);
    });

    // Display currently watching
    const watchingContainer = document.querySelector(".watching");
    mediaList.forEach((list) => {
      list.entries.forEach((entry) => {
        const anime = entry.media;
        const entryElement = document.createElement("a");
        entryElement.href = anime.siteUrl;
        entryElement.target = "_blank";
        entryElement.innerHTML = `
          <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" class="anime-cover" />
          <span>${anime.title.romaji}</span>
        `;
        watchingContainer.appendChild(entryElement);
      });
    });
  })
  .catch((error) => {
    console.error("AniList API error:", error);
  });
