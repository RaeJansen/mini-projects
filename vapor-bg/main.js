const canvas = document.getElementById("vaporwaveBg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initial size
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  drawRectangleCube();
});

// --- Front rectangle proportional to viewport ---
const frontWidth = canvas.width * 0.6; // 40% of canvas width
const frontHeight = canvas.height * 0.6; // 40% of canvas height

const startX = (canvas.width - frontWidth) / 2;
const startY = (canvas.height - frontHeight) / 2;

// --- Front rectangle points ---
const cubeA = { x: startX, y: startY }; // top-left
const cubeB = { x: startX + frontWidth, y: startY }; // top-right
const cubeC = { x: startX + frontWidth, y: startY + frontHeight }; // bottom-right
const cubeD = { x: startX, y: startY + frontHeight }; // bottom-left

// Canvas corners
const cornerA = { x: 0, y: 0 };
const cornerB = { x: canvas.width, y: 0 };
const cornerC = { x: canvas.width, y: canvas.height };
const cornerD = { x: 0, y: canvas.height }; // same as cubeD

// Animation Timeline
let animT = 0;

// Draw a face using A/B/C/D points
const drawFace = ({ A, B, C, D }, color) => {
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.lineTo(D.x, D.y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
};

function drawMesh(face, stepsX, stepsY) {
  const { A, B, C, D } = face;

  // --- Vertical animated lines (inside each column cell) ---
  for (let i = 0; i < stepsX; i++) {
    const t1 = i / stepsX;
    const t2 = (i + 1) / stepsX;

    // interpolate left edge (A→D)
    const leftStartX = A.x + (D.x - A.x) * t1;
    const leftStartY = A.y + (D.y - A.y) * t1;
    const leftEndX = A.x + (D.x - A.x) * t2;
    const leftEndY = A.y + (D.y - A.y) * t2;

    // interpolate right edge (B→C)
    const rightStartX = B.x + (C.x - B.x) * t1;
    const rightStartY = B.y + (C.y - B.y) * t1;
    const rightEndX = B.x + (C.x - B.x) * t2;
    const rightEndY = B.y + (C.y - B.y) * t2;

    // animate inside this slice
    const currentLeftX = leftStartX + (leftEndX - leftStartX) * animT;
    const currentLeftY = leftStartY + (leftEndY - leftStartY) * animT;

    const currentRightX = rightStartX + (rightEndX - rightStartX) * animT;
    const currentRightY = rightStartY + (rightEndY - rightStartY) * animT;

    ctx.beginPath();
    ctx.moveTo(currentLeftX, currentLeftY);
    ctx.lineTo(currentRightX, currentRightY);
    ctx.strokeStyle = "blue";
    ctx.shadowBlur = 5;
    ctx.shadowColor = "blue";
    ctx.stroke();
  }

  // --- Horizontal animated lines (inside each row cell) ---
  for (let i = 0; i < stepsY; i++) {
    const t1 = i / stepsY;
    const t2 = (i + 1) / stepsY;

    // interpolate top edge (A→B)
    const topStartX = A.x + (B.x - A.x) * t1;
    const topStartY = A.y + (B.y - A.y) * t1;
    const topEndX = A.x + (B.x - A.x) * t2;
    const topEndY = A.y + (B.y - A.y) * t2;

    // interpolate bottom edge (D→C)
    const bottomStartX = D.x + (C.x - D.x) * t1;
    const bottomStartY = D.y + (C.y - D.y) * t1;
    const bottomEndX = D.x + (C.x - D.x) * t2;
    const bottomEndY = D.y + (C.y - D.y) * t2;

    // animate inside this slice
    const currentTopX = topStartX + (topEndX - topStartX) * animT;
    const currentTopY = topStartY + (topEndY - topStartY) * animT;

    const currentBottomX = bottomStartX + (bottomEndX - bottomStartX) * animT;
    const currentBottomY = bottomStartY + (bottomEndY - bottomStartY) * animT;

    ctx.beginPath();
    ctx.moveTo(currentTopX, currentTopY);
    ctx.lineTo(currentBottomX, currentBottomY);
    ctx.strokeStyle = "blue";
    ctx.shadowBlur = 5;
    ctx.shadowColor = "blue";
    ctx.stroke();
  }
}

function drawRectangleCube() {
  // --- Draw faces using drawFace ---
  // center face
  drawFace({ A: cubeA, B: cubeB, C: cubeC, D: cubeD }, "black");
  // top face
  drawFace({ A: cornerA, B: cornerB, C: cubeB, D: cubeA }, "black");
  // bottom face
  drawFace({ A: cubeD, B: cubeC, C: cornerC, D: cornerD }, "black");
  // left face
  drawFace({ A: cornerA, B: cubeA, C: cubeD, D: cornerD }, "black");
  // right face
  drawFace({ A: cubeB, B: cornerB, C: cornerC, D: cubeC }, "black");

  // --- Draw mesh using drawMesh ---
  // center mesh
  drawMesh({ A: cubeA, B: cubeB, C: cubeC, D: cubeD }, 10, 10);
  // top mesh
  drawMesh({ A: cornerA, B: cornerB, C: cubeB, D: cubeA }, 10, 10);
  // bottom mesh
  drawMesh({ A: cubeD, B: cubeC, C: cornerC, D: cornerD }, 10, 10);
  // left mesh
  drawMesh({ A: cornerA, B: cubeA, C: cubeD, D: cornerD }, 10, 10);
  // right mesh
  drawMesh({ A: cubeB, B: cornerB, C: cornerC, D: cubeC }, 10, 10);
}

class AnimatedLine {
  constructor(
    direction,
    motion,
    start,
    end,
    fixedStart,
    fixedEnd,
    speed,
    delay = 0,
  ) {
    this.direction = direction; // "vertical" or "horizontal"
    this.motion = motion; // "right", "left", "up", "down"
    this.start = start;
    this.end = end;
    this.fixedStart = fixedStart;
    this.fixedEnd = fixedEnd;
    this.t = 0; // animation progress
    this.speed = speed || 0.0025;

    this.delay = delay; // how long to wait
    this.elapsed = 0; //how much time has passed
  }

  draw() {
    // Wait until delay is over
    if (this.elapsed < this.delay) {
      this.elapsed++;
      return;
    }

    let current;
    if (this.motion === "right" || this.motion === "down") {
      current = this.start + (this.end - this.start) * this.t;
    } else {
      current = this.start - (this.end - this.start) * this.t;
    }

    ctx.beginPath();
    if (this.direction === "vertical") {
      ctx.moveTo(current, this.fixedStart);
      ctx.lineTo(current, this.fixedEnd);
    } else {
      ctx.moveTo(this.fixedStart, current);
      ctx.lineTo(this.fixedEnd, current);
    }
    ctx.strokeStyle = "blue";
    ctx.stroke();

    this.t += this.speed;
    if (this.t > 1) this.t = 0; // loop infinitely
  }
}

const meshLines = [];
let count = 0;
const delayStep = 20;
const stepsX = 10;
const stepsY = 10;

const centerX = (cubeA.x + cubeB.x + cubeC.x + cubeD.x) / 4;
const centerY = (cubeA.y + cubeB.y + cubeC.y + cubeD.y) / 4;

// vertical lines
for (let i = 1; i < stepsX; i++) {
  const tPos = i / stepsX;
  meshLines.push(
    new AnimatedLine(
      "vertical",
      "right",
      centerX,
      cubeB.x,
      cubeA.y,
      cubeD.y,
      0.01,
      count * delayStep,
    ),
  );

  meshLines.push(
    new AnimatedLine(
      "vertical",
      "left",
      centerX,
      cubeB.x,
      cubeA.y,
      cubeD.y,
      0.01,
      count * delayStep,
    ),
  );
  count++;
}

// // horizontal lines
// for (let i = 1; i < stepsY; i++) {
//   meshLines.push(
//     new AnimatedLine(
//       "horizontal",
//       "down",
//       centerY,
//       cubeD.y,
//       cubeA.x,
//       cubeB.x,
//       .5,
//       count * delayStep,
//     ),
//   );
//   meshLines.push(
//     new AnimatedLine(
//       "horizontal",
//       "up",
//       centerY,
//       cubeD.y,
//       cubeA.x,
//       cubeB.x,
//       0.05,
//       count * delayStep,
//     ),
//   );
//   count++;
// }

function animateMesh() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRectangleCube();

  // advance animation
  animT += 0.01;
  if (animT > 1) animT = 0;

  requestAnimationFrame(animateMesh);
}

animateMesh();
