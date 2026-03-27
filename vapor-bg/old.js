// =======================
// SETUP CANVAS
// =======================
const canvas = document.getElementById("vaporwaveBg");
const ctx = canvas.getContext("2d");

// Resize canvas to always fill the screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Fill background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Run once at start
resizeCanvas();

// Update canvas on window resize
window.addEventListener("resize", () => {
  resizeCanvas();
  drawRectangleCube();
});

// =======================
// DEFINE FRONT RECTANGLE (CENTER FACE)
// =======================

// Size of center rectangle (60% of screen)
const frontWidth = canvas.width * 0.6;
const frontHeight = canvas.height * 0.6;

// Position it in the center
const startX = (canvas.width - frontWidth) / 2;
const startY = (canvas.height - frontHeight) / 2;

// Define 4 corners of the center rectangle
const cubeA = { x: startX, y: startY }; // top-left
const cubeB = { x: startX + frontWidth, y: startY }; // top-right
const cubeC = { x: startX + frontWidth, y: startY + frontHeight }; // bottom-right
const cubeD = { x: startX, y: startY + frontHeight }; // bottom-left

// =======================
// CANVAS CORNERS (OUTER EDGES)
// =======================
const cornerA = { x: 0, y: 0 };
const cornerB = { x: canvas.width, y: 0 };
const cornerC = { x: canvas.width, y: canvas.height };
const cornerD = { x: 0, y: canvas.height };

// =======================
// GLOBAL ANIMATION VALUE
// =======================
// animT goes from 0 → 1 repeatedly and controls interpolation
let animT = 0;

// =======================
// DRAW A SINGLE FACE (QUAD)
// =======================
const drawFace = ({ A, B, C, D }, color) => {
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.lineTo(D.x, D.y);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  ctx.stroke(); // outline
};

// =======================
// DRAW GRID (MESH) ON A FACE
// =======================
function drawMesh(face) {
  const { A, B, C, D } = face;

  const stepsX = 1;
  const stepsY = 1;

  // DRAW CELL BOUNDARIES (DEBUG GRID)
  // ctx.lineWidth = 5;

  // ---------- VERTICAL LINES ----------
  for (let i = 0; i < stepsX; i++) {
    const t1 = i / stepsX;
    const t2 = (i + 1) / stepsX;

    // Interpolate along left edge (A → D)
    const leftStartX = A.x + (D.x - A.x) * t1;
    const leftStartY = A.y + (D.y - A.y) * t1;
    const leftEndX = A.x + (D.x - A.x) * t2;
    const leftEndY = A.y + (D.y - A.y) * t2;

    // Interpolate along right edge (B → C)
    const rightStartX = B.x + (C.x - B.x) * t1;
    const rightStartY = B.y + (C.y - B.y) * t1;
    const rightEndX = B.x + (C.x - B.x) * t2;
    const rightEndY = B.y + (C.y - B.y) * t2;

    // Animate between those two positions using animT
    const currentLeftX = leftStartX + (leftEndX - leftStartX) * animT;
    const currentLeftY = leftStartY + (leftEndY - leftStartY) * animT;

    const currentRightX = rightStartX + (rightEndX - rightStartX) * animT;
    const currentRightY = rightStartY + (rightEndY - rightStartY) * animT;

    // Draw the vertical line
    ctx.beginPath();
    ctx.moveTo(currentLeftX, currentLeftY);
    ctx.lineTo(currentRightX, currentRightY);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }
}

// =======================
// DRAW ALL FACES OF "CUBE"
// =======================
function drawRectangleCube() {
  // Draw faces
  drawFace({ A: cubeA, B: cubeB, C: cubeC, D: cubeD }, "lightblue"); // center
  drawFace({ A: cornerA, B: cornerB, C: cubeB, D: cubeA }, "lightgreen"); // top
  drawFace({ A: cubeD, B: cubeC, C: cornerC, D: cornerD }, "lightyellow"); // bottom
  drawFace({ A: cornerA, B: cubeA, C: cubeD, D: cornerD }, "lavender"); // left
  drawFace({ A: cubeB, B: cornerB, C: cornerC, D: cubeC }, "pink"); // right

  // Draw mesh (grid lines)
  drawMesh({ A: cubeA, B: cubeB, C: cubeC, D: cubeD });
  drawMesh({ A: cornerA, B: cornerB, C: cubeB, D: cubeA });
  drawMesh({ A: cubeD, B: cubeC, C: cornerC, D: cornerD });
  drawMesh({ A: cornerA, B: cubeA, C: cubeD, D: cornerD });
  drawMesh({ A: cubeB, B: cornerB, C: cornerC, D: cubeC });
}

// =======================
// ANIMATION LOOP
// =======================
function animateMesh() {
  // Clear canvas every frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw cube + mesh
  drawRectangleCube();

  // Update animation progress (0 → 1 loop)
  animT += 0.01;
  if (animT > 1) animT = 0;

  // Run next frame
  requestAnimationFrame(animateMesh);
}

// Start animation
animateMesh();

///// OLD
// Interpolate along left edge (A → D)
const Ax = A.x + (D.x - A.x) * t1;
const Ay = A.y + (D.y - A.y) * t1;
const Dx = A.x + (D.x - A.x) * t2; //
const Dy = A.y + (D.y - A.y) * t2; //

// Interpolate along right edge (B → C)
const Bx = B.x + (C.x - B.x) * t1;
const By = B.y + (C.y - B.y) * t1;
const Cx = B.x + (C.x - B.x) * t2; //
const Cy = B.y + (C.y - B.y) * t2; //
