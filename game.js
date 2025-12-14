const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let y = 200;
let velocity = 0;
let gravity = 0.6;
let obstacleX = 300;
let score = 0;

canvas.addEventListener("touchstart", jump);

function jump() {
  velocity = -10;
}

function update() {
  ctx.clearRect(0, 0, 300, 400);

  // キャラ
  velocity += gravity;
  y += velocity;
  ctx.fillRect(50, y, 20, 20);

  // 障害物
  obstacleX -= 3;
  if (obstacleX < -20) {
    obstacleX = 300;
    score++;
  }
  ctx.fillRect(obstacleX, 300, 20, 100);

  // 当たり判定
  if (
    50 < obstacleX + 20 &&
    50 + 20 > obstacleX &&
    y + 20 > 300
  ) {
    alert("ゲームオーバー！ スコア：" + score);
    location.reload();
  }

  requestAnimationFrame(update);
}

update();
