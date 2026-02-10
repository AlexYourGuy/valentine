let clicks = 0;
const maxClicks = 20;
let scale = 1;
let transitioned = false;

const heart = document.getElementById("heart");
const heartPath = document.getElementById("heartPath");
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const questionBox = document.getElementById("questionBox");
const finalMessage = document.getElementById("finalMessage");

heart.style.setProperty("--s", scale);

function getClientPos(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

heart.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  const { x, y } = getClientPos(e);
  heart.dataset.px = x;
  heart.dataset.py = y;
  heart.classList.add("pressed");
});

heart.addEventListener("pointerup", (e) => {
  e.preventDefault();
  if (!heart.classList.contains("pressed")) return;

  const { x, y } = getClientPos(e);
  const px = x || parseFloat(heart.dataset.px);
  const py = y || parseFloat(heart.dataset.py);

  heart.classList.remove("pressed");

  clicks++;
  scale += 0.1;
  heart.style.setProperty("--s", scale);
  heart.style.transform = `scale(${scale})`;

  heart.classList.add("glow");
  setTimeout(() => heart.classList.remove("glow"), 120);

  if (heartPath) {
    const warm = Math.min(1, clicks / maxClicks);
    heartPath.style.filter = `saturate(${1 + warm * 0.2}) brightness(${1 + warm * 0.08})`;
  }

  // Partikel an exakter Klickposition
  for (let i = 0; i < 3; i++) {
    const p = document.createElement("div");
    p.className = "particle-heart";
    p.textContent = "💖";
    p.style.left = (px + (Math.random() * 24 - 12)) + "px";
    p.style.top  = (py + (Math.random() * 24 - 12)) + "px";
    p.style.fontSize = (12 + Math.random() * 10) + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }

  if (navigator.vibrate) navigator.vibrate(8);

  if (clicks >= maxClicks && !transitioned) {
    transitioned = true;

    heart.style.animation = "none";
    heart.style.transition = "transform 1000ms ease-in-out, opacity 500ms ease-in-out";
    heart.style.transform = "scale(25)";

    setTimeout(() => {
      heart.style.opacity = "0";
    }, 700);

    setTimeout(() => {
      screen1.classList.remove("active");
      screen2.classList.add("active", "fade-in");
      heart.style.pointerEvents = "none";
    }, 900);
  }
});

// Buttons
noBtn.addEventListener("click", () => {
  const boxRect = questionBox.getBoundingClientRect();
  const maxX = boxRect.width - noBtn.offsetWidth - 16;
  const maxY = boxRect.height - noBtn.offsetHeight - 16;
  noBtn.style.left = Math.random() * maxX + "px";
  noBtn.style.top  = Math.random() * maxY + "px";
});

let heartsInterval = null;
yesBtn.addEventListener("click", () => {
  questionBox.classList.add("fade-out");
  setTimeout(() => {
    questionBox.style.display = "none";
    finalMessage.classList.add("show");
  }, 600);

  if (!heartsInterval) {
    heartsInterval = setInterval(() => {
      const h = document.createElement("div");
      h.className = "floating-heart";
      h.textContent = "💖";
      h.style.left = Math.random() * window.innerWidth + "px";
      h.style.fontSize = (18 + Math.random() * 22) + "px";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 5000);
    }, 220);
  }
});