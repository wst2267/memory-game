/* ===============================
   AUTH CHECK
================================ */
const token = localStorage.getItem("token");
if (!token) {
  location.href = "index.html";
}

/* ===============================
   CONFIG
================================ */
const API = "https://memory-game-backend-0gf8.onrender.com/api";

const themeConfig = {
  animals: {
    unlockAt: 1,
    images: [
      "assets/animals/elephant.png",
      "assets/animals/giraffe.png",
      "assets/animals/hippo.png",
      "assets/animals/monkey.png",
      "assets/animals/panda.png",
      "assets/animals/parrot.png",
      "assets/animals/penguin.png",
      "assets/animals/chicken.png"
    ]
  },
  fruits: {
    unlockAt: 1,
    images: [
      "assets/animals/elephant.png",
      "assets/animals/giraffe.png",
      "assets/animals/hippo.png",
      "assets/animals/monkey.png",
      "assets/animals/panda.png",
      "assets/animals/parrot.png",
      "assets/animals/penguin.png",
      "assets/animals/chicken.png"
    ]
  }
};

/* ===============================
   STATE
================================ */
let level = parseInt(localStorage.getItem("level")) || 1;
let flipped = [];
let matched = 0;
let timer = 0;
let countdown;
let inputLocked = false;
let currentTheme = localStorage.getItem("theme") || "animals";

/* ===============================
   ELEMENTS
================================ */
const boardEl = document.getElementById("board");
const levelEl = document.getElementById("level");
const timerEl = document.getElementById("timer");
const overlay = document.getElementById("overlay");
const resultTitle = document.getElementById("result-title");

/* ===============================
   START GAME
================================ */
startLevel(level);

/* ===============================
   GAME FLOW
================================ */
function startLevel(lv) {
  clearInterval(countdown);

  level = lv;
  localStorage.setItem("level", level);
  levelEl.textContent = level;

  matched = 0;
  flipped = [];
  inputLocked = true;

  timer = getTimeLimit(level);
  timerEl.textContent = timer;

  const [rows, cols] = getBoardSize(level);
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  const pairCount = (rows * cols) / 2;
//   const images = themeConfig.animals.images.slice(0, pairCount);
  const images = themeConfig[currentTheme].images.slice(0, pairCount);
  const cards = shuffle([...images, ...images]);

  boardEl.innerHTML = "";

  cards.forEach(src => {
    const card = document.createElement("div");
    card.className = "card flipped";
    card.innerHTML = `
      <div class="card-face card-front"></div>
      <div class="card-face card-back">
        <img src="${src}">
      </div>
    `;
    card.onclick = () => flipCard(card, src);
    boardEl.appendChild(card);
  });

  // Preview
  setTimeout(() => {
    document
      .querySelectorAll(".card")
      .forEach(c => c.classList.remove("flipped"));
    inputLocked = false;
    startTimer();
  }, getPreviewTime(level));
}

/* ===============================
   CARD LOGIC
================================ */
function flipCard(card, value) {
  if (
    inputLocked ||
    card.classList.contains("flipped") ||
    flipped.length === 2
  ) return;

  card.classList.add("flipped");
  flipped.push({ card, value });

  if (flipped.length === 2) {
    inputLocked = true;
    flipped[0].value === flipped[1].value
      ? match()
      : mismatch();
  }
}

function match() {
  matched += 2;
  flipped = [];
  inputLocked = false;

  if (matched === boardEl.children.length) win();
}

function mismatch() {
  setTimeout(() => {
    flipped.forEach(f => f.card.classList.remove("flipped"));
    flipped = [];
    inputLocked = false;
  }, 700);
}

/* ===============================
   TIMER
================================ */
function startTimer() {
  countdown = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) lose();
  }, 1000);
}

/* ===============================
   RESULT
================================ */
function win() {
  clearInterval(countdown);
  saveProgress(timer);

  resultTitle.textContent = `🎉 Level ${level} Clear!`;
  overlay.classList.remove("hidden");

  setTimeout(() => {
    overlay.classList.add("hidden");
    startLevel(level + 1);
  }, 1200);
}

function lose() {
  clearInterval(countdown);

  resultTitle.textContent = "⏰ Time Up!";
  overlay.classList.remove("hidden");

  setTimeout(() => {
    overlay.classList.add("hidden");
    startLevel(level);
  }, 1200);
}

/* ===============================
   BACKEND
================================ */
async function saveProgress(timeLeft) {
  await fetch(API + "/game/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      level,
      timeLeft
    })
  });
}

/* ===============================
   CURVE
================================ */
function getBoardSize(lv) {
  if (lv < 4) return [2, 3];
  if (lv < 9) return [2, 4];
  if (lv < 16) return [3, 4];
  return [4, 4];
}

function getTimeLimit(lv) {
  if (lv < 5) return 30;
  if (lv < 10) return 28;
  if (lv < 16) return 25;
  return 22;
}

function getPreviewTime(lv) {
  if (lv < 5) return 2000;
  if (lv < 10) return 1500;
  if (lv < 16) return 1000;
  return 700;
}

/* ===============================
   UTIL
================================ */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ===============================
   LOGOUT
================================ */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

function openTheme() {
  renderThemeList();
  document.getElementById("theme-modal")
    .classList.remove("hidden");
}

function closeTheme() {
  document.getElementById("theme-modal")
    .classList.add("hidden");
}

/* ---------- render ---------- */

function renderThemeList() {
  const list = document.getElementById("theme-list");
  list.innerHTML = "";

  Object.keys(themeConfig).forEach(key => {
    const item = document.createElement("div");
    item.className = "theme-item";
    item.innerHTML = `
      <img src="${themeConfig[key].images[0]}">
      <div>${key}</div>
    `;
    item.onclick = () => selectTheme(key);
    list.appendChild(item);
  });
}

/* ---------- select ---------- */

function selectTheme(key) {
  currentTheme = key;
  localStorage.setItem("theme", key);
  closeTheme();

  // รอ modal ปิดก่อน แล้วค่อยเริ่ม level ใหม่
  setTimeout(() => {
    startLevel(level);
  }, 200);
}

function goLeaderboard() {
  location.href = "leaderboard.html";
}
