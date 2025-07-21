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

const username = "Volthaar"; // Your AniList username

const fullQuery = `
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
    lists { entries { media { title { romaji } coverImage { medium } } } }
  }
  manga: MediaListCollection(userName: $name, type: MANGA, status: CURRENT) {
    lists { entries { media { title { romaji } coverImage { medium } } } }
  }
}
`;

async function fetchAniListData() {
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: fullQuery,
        variables: { name: username }
      })
    });

    const data = (await res.json()).data;

    const user = data.User;
    const animeList = data.anime.lists.flatMap(list => list.entries);
    const mangaList = data.manga.lists.flatMap(list => list.entries);

    // Avatar & Username
    document.getElementById("anilist-avatar").innerHTML = `<img src="${user.avatar.large}" alt="${user.name}'s Avatar">`;
    document.getElementById("anilist-username").textContent = user.name;

    // Stats
    document.getElementById("anime-stats").innerHTML = `
      ${user.statistics.anime.count} titles<br>
      ${user.statistics.anime.episodesWatched} episodes<br>
      ${user.statistics.anime.minutesWatched} minutes watched`;
    document.getElementById("manga-stats").innerHTML = `
      ${user.statistics.manga.count} titles<br>
      ${user.statistics.manga.chaptersRead} chapters<br>
      ${user.statistics.manga.volumesRead} volumes read`;

    // Watching (covers only)
    const watchingHTML = animeList.map(entry => `
      <li class="media-item">
        <img src="${entry.media.coverImage.medium}" alt="${entry.media.title.romaji}" title="${entry.media.title.romaji}" />
      </li>`).join('');
    document.getElementById("watching-anime-list").innerHTML = watchingHTML || "<p>Not watching anything currently.</p>";

    // Reading (covers only)
    const readingHTML = mangaList.map(entry => `
      <li class="media-item">
        <img src="${entry.media.coverImage.medium}" alt="${entry.media.title.romaji}" title="${entry.media.title.romaji}" />
      </li>`).join('');
    document.getElementById("reading-manga-list").innerHTML = readingHTML || "<p>Not reading anything currently.</p>";

    // Cultivation Tab Setup
    setupCultivationTab(user.statistics.anime.episodesWatched, user.statistics.manga.chaptersRead);

  } catch (err) {
    console.error("Error fetching AniList data:", err);
  }
}

fetchAniListData();

function setupCultivationTab(animeCount, mangaCount) {
  const tabContent = document.getElementById("tab-cultivation");
  if (!tabContent) return;

  tabContent.innerHTML = `
    <div class="cultivation-container">
      <h2>💠 Cultivation Stats</h2>
      <div class="cultivation-switch">
        <button data-sub="anime" class="cult-sub-btn active">Anime Realm</button>
        <button data-sub="manga" class="cult-sub-btn">Manga Realm</button>
      </div>
      <div class="cultivation-view" data-view="anime">
        <p><strong>Episodes Watched:</strong> ${animeCount.toLocaleString()}</p>
        <p><em>"Eternal Dao Master of Anime"</em></p>
      </div>
      <div class="cultivation-view hidden" data-view="manga">
        <p><strong>Chapters Read:</strong> ${mangaCount.toLocaleString()}</p>
        <p><em>"Heavenly Scripture Devourer"</em></p>
      </div>
    </div>
  `;

  const subs = tabContent.querySelectorAll(".cult-sub-btn");
  const views = tabContent.querySelectorAll(".cultivation-view");

  subs.forEach(btn => {
    btn.addEventListener("click", () => {
      subs.forEach(b => b.classList.remove("active"));
      views.forEach(v => v.classList.add("hidden"));

      btn.classList.add("active");
      tabContent.querySelector(`[data-view="${btn.dataset.sub}"]`)
                .classList.remove("hidden");
    });
  });
}
