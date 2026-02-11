let clicks = 0;
const maxClicks = 1;
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
  const { x, y } = getClientPos(e);
  heart.dataset.px = x;
  heart.dataset.py = y;
  heart.classList.add("pressed");
});

heart.addEventListener("pointerup", (e) => {
  if (!heart.classList.contains("pressed")) return;

  const { x, y } = getClientPos(e);
  const px = x || parseFloat(heart.dataset.px);
  const py = y || parseFloat(heart.dataset.py);

  heart.classList.remove("pressed");

  clicks++;
  scale += 0.1;
  heart.style.setProperty("--s", scale);
  heart.style.transform = `scale(${scale}) translateZ(0)`;

  heart.classList.add("glow");
  setTimeout(() => heart.classList.remove("glow"), 100);

  if (heartPath) {
    const warm = Math.min(1, clicks / maxClicks);
    heartPath.style.filter = `saturate(${1 + warm * 0.15}) brightness(${1 + warm * 0.05})`;
  }

  for (let i = 0; i < 2; i++) {
    const p = document.createElement("div");
    p.className = "particle-heart";
    p.textContent = "💖";
    p.style.left = (px + (Math.random() * 20 - 10)) + "px";
    p.style.top  = (py + (Math.random() * 20 - 10)) + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }

  if (navigator.vibrate) navigator.vibrate(5);

  if (clicks >= maxClicks && !transitioned) {
    transitioned = true;

    heart.style.animation = "none";
    heart.style.transition = "transform 900ms ease-in-out, opacity 400ms ease-in-out";
    heart.style.transform = "scale(22) translateZ(0)";

    setTimeout(() => {
      heart.style.opacity = "0";
    }, 600);

    setTimeout(() => {
      screen1.classList.remove("active");
      screen2.classList.add("active", "fade-in");
      heart.style.pointerEvents = "none";
    }, 800);
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
      h.style.fontSize = (18 + Math.random() * 20) + "px";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 4800);
    }, 260);
  }
});