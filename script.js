// ======== THEME TOGGLE BUTTON ========
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

// ======== CUSTOM CURSOR ========
const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ======== PARTICLES ========
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

// ======== PREVENT TEXT SELECT OUTSIDE BIO ========
document.body.addEventListener('mousedown', (e) => {
  if (!e.target.closest('.bio-block')) {
    e.preventDefault();
  }
});

// ======== BIO TEXT ANIMATION ========
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

// ======== AniList LIVE DATA ========
const username = "Volthaar"; // change to your AniList username

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
  anime: MediaListCollection(userName: $name, type: ANIME, status: CURRENT) {
    lists {
      entries {
        media {
          title {
            romaji
          }
          coverImage {
            medium
          }
        }
      }
    }
  }
  manga: MediaListCollection(userName: $name, type: MANGA, status: CURRENT) {
    lists {
      entries {
        media {
          title {
            romaji
          }
          coverImage {
            medium
          }
        }
      }
    }
  }
}
`;

fetch("https://graphql.anilist.co", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
  body: JSON.stringify({ query, variables: { name: username } }),
})
  .then(res => res.json())
  .then(data => {
    const user = data.data.User;

    // Avatar & username
    document.getElementById("anilist-avatar").innerHTML = `<img src="${user.avatar.large}" alt="${user.name}'s Avatar">`;
    document.getElementById("anilist-username").textContent = user.name;

    // Stats
    document.getElementById("anime-stats").innerHTML = `${user.statistics.anime.count} titles<br>${user.statistics.anime.episodesWatched} episodes<br>${user.statistics.anime.minutesWatched} minutes watched`;
    document.getElementById("manga-stats").innerHTML = `${user.statistics.manga.count} titles<br>${user.statistics.manga.chaptersRead} chapters<br>${user.statistics.manga.volumesRead} volumes read`;

    // Currently Watching Anime List
    const animeList = data.data.anime.lists.flatMap(list => list.entries);
    const watchingHTML = animeList.map(entry => `
      <li class="media-item">
        <img src="${entry.media.coverImage.medium}" alt="${entry.media.title.romaji}" />
        <span>${entry.media.title.romaji}</span>
      </li>
    `).join('');
    document.getElementById("watching-anime-list").innerHTML = watchingHTML || "<p>Not watching anything currently.</p>";

    // Currently Reading Manga List
    const mangaList = data.data.manga.lists.flatMap(list => list.entries);
    const readingHTML = mangaList.map(entry => `
      <li class="media-item">
        <img src="${entry.media.coverImage.medium}" alt="${entry.media.title.romaji}" />
        <span>${entry.media.title.romaji}</span>
      </li>
    `).join('');
    document.getElementById("reading-manga-list").innerHTML = readingHTML || "<p>Not reading anything currently.</p>";
  })
  .catch(err => console.error("AniList fetch error:", err));

// ======== TABS SWITCHING ========
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    // Remove active/show classes
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('show'));

    // Add active/show to clicked
    tab.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('show');
  });
});
