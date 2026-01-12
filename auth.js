const API = "https://memory-game-backend-0gf8.onrender.com/api";

async function login() {
  const username = usernameInput();
  const password = passwordInput();

  const overlay = document.getElementById("loadingOverlay");

  overlay.style.display = "flex";
  msg.textContent = "";

  try {
    const response = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    console.log("data: ", data)

    if (response.ok) {
      msg.style.color = "green";
      msg.textContent = "Login successful!";

      localStorage.setItem("token", data.token);
      localStorage.setItem("level", data.level);
      location.href = "play.html";
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Login failed";
    }

  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Error connecting to server";
  } finally {
    // ซ่อน overlay และ enable ปุ่ม
    overlay.style.display = "none";
  }

  // const res = await fetch(API + "/auth/login", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ username, password })
  // });

  // const data = await res.json();
  // if (data.error) return showMsg(data.error);

  // localStorage.setItem("token", data.token);
  // localStorage.setItem("level", data.level);
  // location.href = "play.html";
}

async function register() {
  var username = usernameInput();
  if (isNullOrEmpty(username)) {
    showMsg("username invalid!", false);
    return;
  }
  if (isNullOrEmpty(passwordInput())) {
    showMsg("password null", false);
    return;
  }

  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameInput(),
      password: passwordInput()
    })
  });

  showMsg("สมัครสำเร็จ 🎉", true);
}

function usernameInput() {
  return document.getElementById("username").value;
}
function passwordInput() {
  return document.getElementById("password").value;
}
function showMsg(msg, ok = false) {
  const el = document.getElementById("msg");
  el.textContent = msg;
  el.style.color = ok ? "#4ade80" : "#f87171";
}

function isNullOrEmpty(value) {
  return value === null || value === undefined || value === '';
}
