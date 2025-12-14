const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const dogImg = new Image();
const bossImg = new Image();

dogImg.src = "2E9A0C29-5DBB-40D6-93EA-3D88B5FBCBD1.png";
bossImg.src = "DA1EA695-9BC6-4BBA-ABC4-596E0E9207AE.png";

let loaded = 0;
[dogImg, bossImg].forEach(img => {
  img.onload = () => {
    loaded++;
    if (loaded === 2) startGame();
  };
});

function startGame() {
  let dog = { x: 40, y: 300, vy: 0 };
  let gravity = 0.6;

  let bosses = [];
  let bullets = [];
  let frame = 0;
  let score = 0;

  canvas.addEventListener("touchstart", shoot);

  function shoot() {
    bullets.push({ x: dog.x + 40, y: dog.y + 20 });
    dog.vy = -9;
  }

  function spawnBottomBoss() {
    bosses.push({ x: 300, y: 280, vx: -3, vy: 0 });
  }

  function spawnTopBoss() {
    bosses.push({ x: Math.random() * 220 + 40, y: -120, vx: 0, vy: 3 });
  }

  function update() {
    frame++;
    ctx.clearRect(0, 0, 300, 400);

    // 犬
    dog.vy += gravity;
    dog.y += dog.vy;
    if (dog.y > 360) dog.y = 360;
    ctx.drawImage(dogImg, dog.x, dog.y, 40, 40);

    // 弾（画像ではなく丸）
    bullets.forEach(b => {
      b.x += 6;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "gold";
      ctx.fill();
    });
    bullets = bullets.filter(b => b.x < 320);

    // ママ出現
    if (frame % 120 === 0) spawnBottomBoss();
    if (frame % 300 === 0) spawnTopBoss();

    bosses.forEach((b, bi) => {
      b.x += b.vx;
      b.y += b.vy;

      ctx.drawImage(bossImg, b.x, b.y, 50, 120);

      // 犬に当たったら終了
      if (
        dog.x < b.x + 50 &&
        dog.x + 40 > b.x &&
        dog.y < b.y + 120 &&
        dog.y + 40 > b.y
      ) {
        alert("ゲームオーバー！ スコア：" + score);
        location.reload();
      }

      // 弾ヒット判定
      bullets.forEach((bu, i) => {
        if (
          bu.x > b.x &&
          bu.x < b.x + 50 &&
          bu.y > b.y &&
          bu.y < b.y + 120
        ) {
          bosses.splice(bi, 1);
          bullets.splice(i, 1);
          score++;
        }
      });
    });

    requestAnimationFrame(update);
  }

  update();
}
