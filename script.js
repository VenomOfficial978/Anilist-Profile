// ======== THEME TOGGLE BUTTON ========
const toggleBtn = document.querySelector('.toggle-btn');
const body = document.body;
toggleBtn.addEventListener('click', () => {
  body.classList.toggle('light');
  toggleBtn.classList.toggle('light-mode');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    body.classList.add('light');
    toggleBtn.classList.add('light-mode');
  }
  const bio = document.querySelector('.bio-block');
  if (bio && isElementInViewport(bio)) animateBioText();
});

// ======== CUSTOM CURSOR ========
const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ======== PARTICLES ========
const particles = document.getElementById('particles');
function createParticle(){
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random()*6+4;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.left = `${Math.random()*window.innerWidth}px`;
  p.style.top = `${window.innerHeight + size}px`;
  const dur = Math.random()*7+8;
  p.style.animationDuration = `${dur}s`;
  p.style.animationDelay = `${Math.random()*dur}s`;
  particles.append(p);
  p.addEventListener('animationend', ()=>{ p.remove(); createParticle(); });
}
for(let i=0;i<30;i++) createParticle();

// ======== PREVENT TEXT SELECT OUTSIDE BIO ========
document.body.addEventListener('mousedown', e => {
  if (!e.target.closest('.bio-block')) e.preventDefault();
});

// ======== BIO TEXT ANIMATION ========
function animateBioText(){
  document.querySelectorAll('.bio-block p:not(.animate)').forEach((p,i)=>{
    setTimeout(()=> p.classList.add('animate'), i*300);
  });
}
function isElementInViewport(el){
  const r = el.getBoundingClientRect();
  return r.top <= window.innerHeight*0.85 && r.bottom >= 0;
}
window.addEventListener('scroll', () => {
  const bio = document.querySelector('.bio-block');
  if (bio && isElementInViewport(bio)) animateBioText();
});

// ======== AniList Data & Popup ========
const username = "Volthaar";

const mainQuery = `
query ($name: String) {
  User(name: $name) { name avatar { large } statistics { anime { count episodesWatched minutesWatched } manga { count chaptersRead volumesRead } } }
  anime: MediaListCollection(userName: $name, type: ANIME, status: CURRENT) { lists { entries { media { title { romaji } coverImage { medium } description(asHtml: false) siteUrl } } } }
  manga: MediaListCollection(userName: $name, type: MANGA, status: CURRENT) { lists { entries { media { title { romaji } coverImage { medium } description(asHtml: false) siteUrl } } } }
}
`;

fetch("https://graphql.anilist.co", {
  method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
  body: JSON.stringify({ query: mainQuery, variables: { name: username } })
})
.then(res => res.json())
.then(data => {
  const user = data.data.User;
  document.getElementById("anilist-avatar").innerHTML = `<img src="${user.avatar.large}" alt="${user.name}'s Avatar">`;
  document.getElementById("anilist-username").textContent = user.name;
  document.getElementById("anime-stats").innerHTML = `${user.statistics.anime.count} titles<br>${user.statistics.anime.episodesWatched} episodes<br>${user.statistics.anime.minutesWatched} minutes watched`;
  document.getElementById("manga-stats").innerHTML = `${user.statistics.manga.count} titles<br>${user.statistics.manga.chaptersRead} chapters<br>${user.statistics.manga.volumesRead} volumes read`;

  const animeItems = data.data.anime.lists.flatMap(l => l.entries);
  const mangaItems = data.data.manga.lists.flatMap(l => l.entries);

  const animeHTML = animeItems.map(e => `
    <li class="media-item" data-title="${e.media.title.romaji}" data-desc="${e.media.description||'No description'}" data-url="${e.media.siteUrl}">
      <img src="${e.media.coverImage.medium}" alt="${e.media.title.romaji}" title="${e.media.title.romaji}" />
    </li>`).join('');
  document.getElementById("watching-anime-list").innerHTML = animeHTML || "<p>Not watching anything currently.</p>";

  const mangaHTML = mangaItems.map(e => `
    <li class="media-item" data-title="${e.media.title.romaji}" data-desc="${e.media.description||'No description'}" data-url="${e.media.siteUrl}">
      <img src="${e.media.coverImage.medium}" alt="${e.media.title.romaji}" title="${e.media.title.romaji}" />
    </li>`).join('');
  document.getElementById("reading-manga-list").innerHTML = mangaHTML || "<p>Not reading anything currently.</p>";

  attachPopupListeners();
})
.catch(err => console.error("AniList fetch error:", err));

// ======== Tabs Switching ========
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t=>t.classList.remove('active'));
  contents.forEach(c=>c.classList.remove('show'));
  tab.classList.add('active');
  document.getElementById(`tab-${tab.getAttribute('data-tab')}`).classList.add('show');
}));

// ======== Popup Modal Only in Watching Tab ========
const popup = document.getElementById("media-popup");
const popImg = popup.querySelector(".popup-image");
const popTitle = popup.querySelector(".popup-title");
const popDesc = popup.querySelector(".popup-desc");
const closeBtn = popup.querySelector(".close-btn");

function attachPopupListeners(){
  const watching = document.getElementById("tab-watching");
  watching.querySelectorAll(".media-item").forEach(item => {
    item.addEventListener("click", () => {
      popImg.innerHTML = `<img src="${item.querySelector('img')?.src}" alt="">`;
      popTitle.textContent = item.getAttribute("data-title");
      popDesc.innerHTML = item.getAttribute("data-desc");
      popup.classList.add("show");
    });
  });
}

closeBtn.addEventListener('click', ()=> popup.classList.remove('show'));
popup.addEventListener('click', e => { if(e.target===popup) popup.classList.remove('show'); });

// ======== Recent Activity Fetch ========
async function fetchActivity(user){
  const q = `
    query ($name: String) {
      Page(perPage: 10) {
        activities(userName: $name, sort: ID_DESC) {
          __typename
          ... on ListActivity {
            status progress createdAt media { title { romaji } siteUrl }
          }
          ... on TextActivity {
            text createdAt
          }
        }
      }
    }`;
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST", headers:{ "Content-Type": "application/json", Accept:"application/json" },
    body: JSON.stringify({ query: q, variables: { name: user } })
  });
  const json = await res.json();
  const feed = document.getElementById("recent-activity-list");
  if (!feed) return;
  feed.innerHTML = "";
  json.data.Page.activities.forEach(a => {
    const li = document.createElement("li");
    if (a.__typename === "ListActivity") {
      const prog = a.progress ? ` – ${a.progress}` : "";
      li.innerHTML = `<a href="${a.media.siteUrl}" target="_blank">${a.status}${prog} <b>${a.media.title.romaji}</b></a>`;
    } else if (a.__typename === "TextActivity") {
      li.innerHTML = `<span>${new Date(a.createdAt*1000).toLocaleDateString()}: ${a.text}</span>`;
    }
    feed.append(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchActivity(username);
});
