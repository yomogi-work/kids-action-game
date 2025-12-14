<canvas id="game" width="320" height="400"></canvas>
<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

//
// ===== 画像 =====
//
const dogImg = new Image();
const bossImg = new Image();
const bossAngryImg = new Image();

dogImg.onerror = () => console.error("犬画像が読み込めていません");
bossImg.onerror = () => console.error("普通ママ画像が読み込めていません");
bossAngryImg.onerror = () => console.error("怒ったママ画像が読み込めていません");

dogImg.src = "2E9A0C29-5DBB-40D6-93EA-3D88B5FBCBD1.png";
bossImg.src = "DA1EA695-9BC6-4BBA-ABC4-596E0E9207AE.png";
bossAngryImg.src = "boss_angry.jpeg";

//
// ===== 読み込み待ち =====
//
let loaded = 0;
[dogImg, bossImg, bossAngryImg].forEach(img => {
  img.onload = () => {
    loaded++;
    if (loaded === 3) startGame();
  };
});

function startGame() {

  //
  // ===== 犬 =====
  //
  const dog = { x: 40, y: 340, vx: 0, vy: 0 };
  const gravity = 0.6;

  //
  // ===== ママ =====
  //
  let bosses = [];

  //
  // ===== 弾 =====
  //
  let bullets = [];
  let enemyBullets = [];

  let frame = 0;
  let score = 0;

  //
  // ===== 操作（タッチ） =====
  //
  canvas.addEventListener("touchstart", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;

    dog.vx = x < canvas.width / 2 ? -4 : 4;
    dog.vy = -9;

    bullets.push({ x: dog.x + 40, y: dog.y + 20 });
  });

  canvas.addEventListener("touchend", () => dog.vx = 0);

  //
  // ===== ママ生成 =====
  //
  function spawnBottomBoss() {
    bosses.push({
      x: 300,
      y: 280,
      vx: -2.5,
      vy: 0,
      hp: 3,
      angry: 0
    });
  }

  function spawnTopBoss() {
    bosses.push({
      x: Math.random() * 200 + 40,
      y: -140,
      vx: 0,
      vy: 2.5,
      hp: 3,
      angry: 0
    });
  }

  //
  // ===== メインループ =====
  //
  function update() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ---- 犬 ----
    dog.vy += gravity;
    dog.y += dog.vy;
    dog.x += dog.vx;

    if (dog.y > 360) dog.y = 360;
    if (dog.x < 0) dog.x = 0;
    if (dog.x > 280) dog.x = 280;

    ctx.drawImage(dogImg, dog.x, dog.y, 40, 40);

    // ---- 犬の弾 ----
    bullets.forEach(b => {
      b.x += 6;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "gold";
      ctx.fill();
    });
    bullets = bullets.filter(b => b.x < 340);

    // ---- ママ出現 ----
    if (frame % 120 === 0) spawnBottomBoss();
    if (frame % 300 === 0) spawnTopBoss();

    // ---- ママ処理 ----
    for (let i = bosses.length - 1; i >= 0; i--) {
      const b = bosses[i];

      b.x += b.vx;
      b.y += b.vy;

      if (b.angry > 0) {
        ctx.drawImage(bossAngryImg, b.x, b.y, 60, 140);
        b.angry--;
      } else {
        ctx.drawImage(bossImg, b.x, b.y, 50, 120);
      }

      // HPバー
      ctx.fillStyle = "red";
      ctx.fillRect(b.x, b.y - 8, b.hp * 15, 5);

      // 犬と接触
      if (
        dog.x < b.x + 50 &&
        dog.x + 40 > b.x &&
        dog.y < b.y + 120 &&
        dog.y + 40 > b.y
      ) {
        alert("ゲームオーバー！ SCORE: " + score);
        location.reload();
      }

      // 犬の弾ヒット
      for (let j = bullets.length - 1; j >= 0; j--) {
        const bu = bullets[j];
        if (
          bu.x > b.x &&
          bu.x < b.x + 50 &&
          bu.y > b.y &&
          bu.y < b.y + 120
        ) {
          bullets.splice(j, 1);
          b.hp--;
          b.angry = 120;

          if (b.hp <= 0) {
            bosses.splice(i, 1);
            score += 5;
            break;
          }
        }
      }

      // 反撃
      if (b.angry > 0 && frame % 40 === 0) {
        enemyBullets.push({
          x: b.x,
          y: b.y + 60
        });
      }
    }

    // ---- ママ弾 ----
    enemyBullets.forEach(e => {
      e.x -= 4;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      if (
        e.x > dog.x &&
        e.x < dog.x + 40 &&
        e.y > dog.y &&
        e.y < dog.y + 40
      ) {
        alert("ママ激怒！ゲームオーバー！");
        location.reload();
      }
    });
    enemyBullets = enemyBullets.filter(e => e.x > -20);

    // ---- スコア ----
    ctx.fillStyle = "black";
    ctx.font = "16px sans-serif";
    ctx.fillText("SCORE: " + score, 10, 20);

    requestAnimationFrame(update);
  }

  update();
}
</script>
