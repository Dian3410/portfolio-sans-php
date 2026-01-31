/******************************
 * 🌐 FOND RÉSEAU ANIMÉ
 ******************************/
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const nodes = [];
const NODE_COUNT = 70;
const MAX_DIST = 140;

for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  });
}

function animateNetwork() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(56,189,248,0.8)";
    ctx.fill();
  });

  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < MAX_DIST) {
        ctx.strokeStyle = `rgba(56,189,248,${1 - d / MAX_DIST})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateNetwork);
}
animateNetwork();

/******************************
 * 🔵 TEXTE DYNAMIQUE
 ******************************/
const texts = [
  "Étudiant en BTS SIO",
  "Cybersécurité",
  "Systèmes & Réseaux",
  "Développement Web & Programmation"
];
let i = 0;
const dyn = document.getElementById("dynamicText");

setInterval(() => {
  dyn.textContent = texts[i];
  i = (i + 1) % texts.length;
}, 3000);

/******************************
 * 🌍 LANGUE
 ******************************/
document.getElementById("langSelect").addEventListener("change", e => {
  document.querySelectorAll("[data-fr]").forEach(el => {
    el.textContent =
      e.target.value === "fr" ? el.dataset.fr : el.dataset.en;
  });
});

/******************************
 * 🌙 THEME
 ******************************/
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

/******************************
 * 🧠 MORPION IA
 ******************************/
const cells = document.querySelectorAll("#morpion .cell");
let board = Array(9).fill(null);
const HUMAN = "X";
const AI = "O";

cells.forEach((cell, i) => {
  cell.addEventListener("click", () => {
    if (board[i]) return;
    play(i, HUMAN);
    const best = minimax(board, AI).index;
    if (best !== undefined) play(best, AI);
  });
});

function play(i, p) {
  board[i] = p;
  cells[i].textContent = p;
  if (checkWin(p)) {
    setTimeout(() => alert(p === HUMAN ? "Bravo !" : "IA gagne !"), 100);
    reset();
  } else if (board.every(c => c)) {
    setTimeout(() => alert("Match nul"), 100);
    reset();
  }
}

function reset() {
  board = Array(9).fill(null);
  cells.forEach(c => (c.textContent = ""));
}

function checkWin(p) {
  const w = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return w.some(c => c.every(i => board[i] === p));
}

function minimax(b, p) {
  const avail = b.map((v,i)=>v?null:i).filter(v=>v!==null);
  if (checkWin(HUMAN)) return { score: -10 };
  if (checkWin(AI)) return { score: 10 };
  if (!avail.length) return { score: 0 };

  const moves = [];
  for (let i of avail) {
    const move = { index: i };
    b[i] = p;
    move.score = minimax(b, p === AI ? HUMAN : AI).score;
    b[i] = null;
    moves.push(move);
  }

  return moves.reduce((best, m) =>
    (p === AI ? m.score > best.score : m.score < best.score) ? m : best
  );
}