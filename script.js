// ======== Theme Toggle ========
const toggleTheme = document.getElementById('theme-toggle');
toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}

// ======== Cursor Follower ========
const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ======== Particles ========
particlesJS.load('particles-js', 'particles.json', function () {
  console.log('Particles.js loaded.');
});

// ======== Bio Animation ========
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('animate');
  });
});

document.querySelectorAll('.bio-content').forEach(el => observer.observe(el));

// ======== AniList LIVE DATA – updated to include description ========
const username = "DashBear";

const query = `
query ($name: String) {
  User(name: $name) {
    name
    avatar { large }
    statistics { anime { count episodesWatched minutesWatched } manga { count chaptersRead volumesRead } }
  }
  anime: MediaListCollection(userName: $name, type: ANIME, status: CURRENT) {
    lists { entries { media { id title { romaji } coverImage { medium } description } } }
  }
  manga: MediaListCollection(userName: $name, type: MANGA, status: CURRENT) {
    lists { entries { media { id title { romaji } coverImage { medium } description } } }
  }
}`;

fetch("https://graphql.anilist.co", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
  body: JSON.stringify({ query, variables: { name: username } }),
})
.then(res => res.json())
.then(data => {
  const animeList = data.data.anime.lists.flatMap(l => l.entries);
  const mangaList = data.data.manga.lists.flatMap(l => l.entries);

  document.getElementById("watching-anime-list").innerHTML =
    animeList.map(e => `
      <li class="media-item" data-title="${e.media.title.romaji}" data-desc="${e.media.description || ''}">
        <img src="${e.media.coverImage.medium}" alt="${e.media.title.romaji}" />
      </li>
    `).join('') || "<p>Not watching currently.</p>";

  document.getElementById("reading-manga-list").innerHTML =
    mangaList.map(e => `
      <li class="media-item" data-title="${e.media.title.romaji}" data-desc="${e.media.description || ''}">
        <img src="${e.media.coverImage.medium}" alt="${e.media.title.romaji}" />
      </li>
    `).join('') || "<p>Not reading currently.</p>";

  document.querySelectorAll('.media-item').forEach(item => {
    item.addEventListener('click', () => {
      showCoverPopup(item.getAttribute('data-title'), item.getAttribute('data-desc'));
    });
  });
})
.catch(err => console.error("Error fetching AniList data:", err));

// ======== Cover popup modal setup ========
function showCoverPopup(title, desc) {
  let overlay = document.querySelector('.cover-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'cover-overlay';
    overlay.innerHTML = `
      <div class="cover-popup">
        <span class="cover-close">&times;</span>
        <h2 class="cover-title"></h2>
        <p class="cover-desc"></p>
      </div>`;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.classList.contains('cover-close')) {
        overlay.remove();
      }
    });
  }

  overlay.querySelector('.cover-title').textContent = title;
  overlay.querySelector('.cover-desc').innerHTML = desc || '<em>No description available.</em>';
  overlay.classList.add('show');
}

// ======== Tab Switching ========
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const t = tab.getAttribute('data-tab');
    tabs.forEach(tBtn => tBtn.classList.remove('active'));
    contents.forEach(c => c.classList.remove('show'));
    tab.classList.add('active');
    document.getElementById(`tab-${t}`).classList.add('show');
  });
});
