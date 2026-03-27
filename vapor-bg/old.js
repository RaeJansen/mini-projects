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

// Define 4 corners of the center rectangle
const cubeA = { x: startX, y: startY };
const cubeB = { x: startX + frontWidth, y: startY };
const cubeC = { x: startX + frontWidth, y: startY + frontHeight };
const cubeD = { x: startX, y: startY + frontHeight };

// =======================
// CANVAS CORNERS (OUTER EDGES)
// =======================
const cornerA = { x: 0, y: 0 };
const cornerB = { x: canvas.width, y: 0 };
const cornerC = { x: canvas.width, y: canvas.height };
const cornerD = { x: 0, y: canvas.height };

// =======================
// Centre Points
// =======================
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// =======================
// GLOBAL ANIMATION VALUE
// =======================
// animT goes from 0 → 1 repeatedly and controls interpolation
let animT = 0;

// =======================
// DRAW A SINGLE FACE (QUAD)
// =======================
const drawFace = ({ A, B, C, D }) => {
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.lineTo(D.x, D.y);
  ctx.closePath();

  ctx.fillStyle = "white";
  ctx.fill();

  ctx.stroke();
};

// =======================
// DRAW GRID (MESH) ON A FACE
// =======================
const drawMesh = (face) => {
  const { A, B, C, D } = face;

  //# of mesh lines
  const stepsX = 5;
  const stepsY = 5;

  // ---------- HORIZONTAL LINES ----------
  for (let i = 0; i < stepsX; i++) {
    const t1 = i / stepsX;
    const t2 = (i + 1) / stepsX;
    const centerY = canvas.height / 2;

    // Interpolate along left edge (A → D)
    const Ax = A.x + (D.x - A.x) * t1;
    const Ay = A.y + (D.y - A.y) * t1;
    const Dx = D.x + (A.x - D.x) * t2; //
    const Dy = A.y + (D.y - A.y) * t2; //

    // Interpolate along right edge (B → C)
    const Bx = B.x + (C.x - B.x) * t1;
    const By = B.y + (C.y - B.y) * t1;
    const Cx = B.x + (C.x - B.x) * t2; //
    const Cy = B.y + (C.y - B.y) * t2; //

    let startX;
    let endX;
    let startY;
    let endY;

    // Determine direction of animation
    if (Ay >= centerY) {
      // Animate between those two positions using animT
      startX = Ax + (Dx - Ax) * animT;
      3;
      endX = Bx + (Cx - Bx) * animT;

      startY = Ay + (Dy - Ay) * animT;
      endY = By + (Cy - By) * animT;
    } else {
      startX = D.x + (Ax - Dx) * animT;
      endX = Cx + (Bx - Cx) * animT;

      startY = Dy + (Ay - Dy) * animT;
      endY = Cy + (By - Cy) * animT;
    }

    // Draw the vertical line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  // ---------- VERTICAL LINES ----------
  for (let i = 0; i < stepsY; i++) {
    const t1 = i / stepsY;
    const t2 = (i + 1) / stepsY;
    const centerX = canvas.width / 2;

    // Interpolate along top edge (A → B)
    const Ax = A.x + (B.x - A.x) * t1;
    const Ay = A.y + (B.y - A.y) * t1;
    const Bx = A.x + (B.x - A.x) * t2;
    const By = A.y + (B.y - A.y) * t2;

    // Interpolate along bottom edge (D → C)
    const Cx = D.x + (C.x - D.x) * t1;
    const Cy = D.y + (C.y - D.y) * t1;
    const Dx = D.x + (C.x - D.x) * t2;
    const Dy = D.y + (C.y - D.y) * t2;

    let startX;
    let startY;
    let endX;
    let endY;
    if (Ax >= centerX) {
      // Animate
      startY = Ay + (By - Ay) * animT;
      endY = Cy + (Dy - Cy) * animT;

      startX = Ax + (Bx - Ax) * animT;
      endX = Cx + (Dx - Cx) * animT;
    } else {
      // Animate
      startY = By + (Ay - By) * animT;
      endY = Cy + (Dy - Cy) * animT;

      startX = Bx + (Ax - Bx) * animT;
      endX = Dx + (Cx - Dx) * animT;
    }

    // Draw vertical line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }
};

// =======================
// DRAW ALL FACES OF "CUBE"
// =======================
function drawRectangleCube() {
  // Draw faces -----------------

  // CENTER
  drawFace(
    {
      A: cubeA,
      B: { x: centerX, y: startY },
      C: { x: centerX, y: centerY },
      D: { x: startX, y: centerY },
    },
    "lightblue",
  ); // center top left
  drawFace(
    {
      A: { x: centerX, y: startY },
      B: cubeB,
      C: { x: startX + frontWidth, y: centerY },
      D: { x: centerX, y: centerY },
    },
    "blue",
  ); // center top right
  drawFace(
    {
      A: { x: startX, y: centerY },
      B: { x: centerX, y: centerY },
      C: { x: centerX, y: startY + frontHeight },
      D: cubeD,
    },
    "teal",
  ); // center bottom left
  drawFace({
    A: { x: centerX, y: centerY },
    B: { x: startX + frontWidth, y: centerY },
    C: cubeC,
    D: { x: centerX, y: startY + frontHeight },
  }); // center bottom right

  // TOP
  // drawFace({ A: cornerA, B: cornerB, C: cubeB, D: cubeA }, "lightgreen"); // top
  drawFace({
    A: cornerA,
    B: { x: centerX, y: 0 },
    C: { x: centerX, y: startY },
    D: cubeA,
  }); // top left
  drawFace({
    A: { x: centerX, y: 0 },
    B: cornerB,
    C: cubeB,
    D: { x: centerX, y: startY },
  }); // top right

  // BOTTOM
  // drawFace({ A: cubeD, B: cubeC, C: cornerC, D: cornerD }, "lightyellow"); // bottom left
  drawFace({
    A: cubeD,
    B: { x: centerX, y: startY + frontHeight },
    C: { x: centerX, y: canvas.height },
    D: cornerD,
  }); // bottom left
  drawFace({
    A: { x: centerX, y: startY + frontHeight },
    B: cubeC,
    C: cornerC,
    D: { x: centerX, y: canvas.height },
  }); // bottom right

  // LEFT
  // drawFace({ A: cornerA, B: cubeA, C: cubeD, D: cornerD }, "lavender"); // left
  drawFace({
    A: cornerA,
    B: cubeA,
    C: { x: startX, y: centerY },
    D: { x: 0, y: centerY },
  }); // left top
  drawFace({
    A: { x: 0, y: centerY },
    B: { x: startX, y: centerY },
    C: cubeD,
    D: cornerD,
  }); // left bottom

  // RIGHT
  // drawFace({ A: cubeB, B: cornerB, C: cornerC, D: cubeC }, "pink"); // right
  drawFace({
    A: cubeB,
    B: cornerB,
    C: { x: canvas.width, y: centerY },
    D: { x: startX + frontWidth, y: centerY },
  }); // right top
  drawFace({
    A: { x: startX + frontWidth, y: centerY },
    B: { x: canvas.width, y: centerY },
    C: cornerC,
    D: cubeC,
  }); // right bottom

  // Draw Mesh -----------------

  // CENTER
  drawMesh({
    A: cubeA,
    B: { x: centerX, y: startY },
    C: { x: centerX, y: centerY },
    D: { x: startX, y: centerY },
  }); // center top left
  drawMesh({
    A: { x: centerX, y: startY },
    B: cubeB,
    C: { x: startX + frontWidth, y: centerY },
    D: { x: centerX, y: centerY },
  }); // center top right
  drawMesh({
    A: { x: startX, y: centerY },
    B: { x: centerX, y: centerY },
    C: { x: centerX, y: startY + frontHeight },
    D: cubeD,
  }); // center bottom left
  drawMesh({
    A: { x: centerX, y: centerY },
    B: { x: startX + frontWidth, y: centerY },
    C: cubeC,
    D: { x: centerX, y: startY + frontHeight },
  }); // center bottom right

  // TOP
  // drawMesh({ A: cornerA, B: cornerB, C: cubeB, D: cubeA }, "lightgreen"); // top
  drawMesh({
    A: cornerA,
    B: { x: centerX, y: 0 },
    C: { x: centerX, y: startY },
    D: cubeA,
  }); // top left
  drawMesh({
    A: { x: centerX, y: 0 },
    B: cornerB,
    C: cubeB,
    D: { x: centerX, y: startY },
  }); // top right

  // BOTTOM
  // drawMesh({ A: cubeD, B: cubeC, C: cornerC, D: cornerD }, "lightyellow"); // bottom left
  drawMesh({
    A: cubeD,
    B: { x: centerX, y: startY + frontHeight },
    C: { x: centerX, y: canvas.height },
    D: cornerD,
  }); // bottom left
  drawMesh({
    A: { x: centerX, y: startY + frontHeight },
    B: cubeC,
    C: cornerC,
    D: { x: centerX, y: canvas.height },
  }); // bottom right

  // LEFT
  // drawMesh({ A: cornerA, B: cubeA, C: cubeD, D: cornerD }, "lavender"); // left
  drawMesh({
    A: cornerA,
    B: cubeA,
    C: { x: startX, y: centerY },
    D: { x: 0, y: centerY },
  }); // left top
  drawMesh({
    A: { x: 0, y: centerY },
    B: { x: startX, y: centerY },
    C: cubeD,
    D: cornerD,
  }); // left bottom

  // RIGHT
  // drawMesh({ A: cubeB, B: cornerB, C: cornerC, D: cubeC }, "pink"); // right
  drawMesh({
    A: cubeB,
    B: cornerB,
    C: { x: canvas.width, y: centerY },
    D: { x: startX + frontWidth, y: centerY },
  }); // right top
  drawMesh({
    A: { x: startX + frontWidth, y: centerY },
    B: { x: canvas.width, y: centerY },
    C: cornerC,
    D: cubeC,
  }); // right bottom
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
  animT += 0.005;
  if (animT > 1) animT = 0;

  // Run next frame
  requestAnimationFrame(animateMesh);
}

// Start animation
animateMesh();
