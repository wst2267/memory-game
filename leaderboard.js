const token = localStorage.getItem("token");
if (!token) location.href = "index.html";

const API = "https://memory-game-backend-0gf8.onrender.com/api/leaderboard";

fetch(API, {
  headers: { "Authorization": token }
})
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("list");
    list.innerHTML = "";
    data.forEach((u, i) => {
      const li = document.createElement("li");
      li.textContent = `#${i+1} ${u.username} — ${u.bestScore} pts (Level ${u.maxLevel})`;
      list.appendChild(li);
    });
  })
  .catch(err => console.error(err));
