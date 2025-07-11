const socket = io();
let playerY = 250;
let otherY = 250;

function joinGame() {
  const name = document.getElementById("playerName").value;
  if (!name) return;
  socket.emit("join", name);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") playerY -= 10;
  if (e.key === "ArrowDown") playerY += 10;
  socket.emit("move", playerY);
});

socket.on("lobby", names => {
  document.getElementById("waiting").innerText = "Bağlı Oyuncular:\n" + names.join(", ");
});

socket.on("startGame", () => {
  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";
  gameLoop();
});

socket.on("players", players => {
  for (let id in players) {
    if (id !== socket.id) {
      otherY = players[id].y;
    }
  }
});

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(10, playerY, 10, 100);
  ctx.fillRect(780, otherY, 10, 100);
  ctx.beginPath();
  ctx.arc(400, 300, 10, 0, Math.PI * 2);
  ctx.fill();
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
