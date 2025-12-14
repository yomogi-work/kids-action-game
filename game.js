const dogImg = new Image();
dogImg.src = "2E9A0C29-5DBB-40D6-93EA-3D88B5FBCBD1.png";

const bossImg = new Image();
bossImg.src = "DA1EA695-9BC6-4BBA-ABC4-596E0E9207AE.png";

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
  ctx.drawImage(dogImg, 40, y, 40, 40); 
  // 障害物
  obstacleX -= 3;
  if (obstacleX < -20) {
    obstacleX = 300;
    score++;
  }
  ctx.drawImage(bossImg, obstacleX, 280, 50, 120);

  // 当たり判定
  if (
  40 < obstacleX + 50 &&
  40 + 40 > obstacleX &&
  y + 40 > 280
  ) {
    alert("ゲームオーバー！ スコア：" + score);
    location.reload();
  }

  requestAnimationFrame(update);
}

update();
