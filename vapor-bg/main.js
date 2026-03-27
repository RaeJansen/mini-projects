/** VAPORWAVE BG CANVAS
 *                 y
 *       A         |B        C
 *         D ______|E_____ F
 *    x__G__|H_____|I_____|J__K__x
 *          |______|______|
 *         L       |M      N
 *       O         |P       Q
 *                 y
 */

// grab html canvas element
const canvas = document.getElementById("vaporwaveBg");

// set up canvas for drawing
const ctx = canvas.getContext("2d");

// make canvas responsive
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // fill bg
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// run on open
resizeCanvas();

// update window on resize
window.addEventListener("resize", () => {
  resizeCanvas();
});

// set global animation value
let animT = 0;

// FACES
// size of centre rectangle
const frontWidth = canvas.width * 0.6;
const frontHeight = canvas.height * 0.6;

// position centre rectangle in centre
const startX = (canvas.width - frontWidth) / 2;
const startY = (canvas.height - frontHeight) / 2;

// define centre of canvas
const centreX = canvas.width / 2;
const centreY = canvas.height / 2;

// define all face point coordinates (reference diagram at top)
const Points = {
  A: { x: 0, y: 0 },
  B: { x: centreX, y: 0 },
  C: { x: canvas.width, y: 0 },
  D: { x: startX, y: startY },
  E: { x: centreX, y: startY },
  F: { x: startX + frontWidth, y: startY },
  G: { x: 0, y: centreY },
  H: { x: startX, y: centreY },
  I: { x: centreX, y: centreY },
  J: { x: startX + frontWidth, y: centreY },
  K: { x: canvas.width, y: centreY },
  L: { x: startX, y: startY + frontHeight },
  M: { x: centreX, y: startY + frontHeight },
  N: { x: startX + frontWidth, y: startY + frontHeight },
  O: { x: 0, y: canvas.height },
  P: { x: centreX, y: canvas.height },
  Q: { x: canvas.width, y: canvas.height },
};

// show points (debugging)
// Object.values(Points).forEach((point) => {
//   const { x, y } = point;

// });

// define all faces
const Faces = {
  face1: [Points.A, Points.B, Points.E, Points.D],
  face2: [Points.B, Points.C, Points.F, Points.E],
  face3: [Points.A, Points.D, Points.H, Points.G],
  face4: [Points.D, Points.E, Points.I, Points.H],
  face5: [Points.E, Points.F, Points.J, Points.I],
  face6: [Points.F, Points.C, Points.K, Points.J],
  face7: [Points.G, Points.H, Points.L, Points.O],
  face8: [Points.H, Points.I, Points.M, Points.L],
  face9: [Points.I, Points.J, Points.N, Points.M],
  face10: [Points.J, Points.K, Points.Q, Points.N],
  face11: [Points.L, Points.M, Points.P, Points.O],
  face12: [Points.M, Points.N, Points.Q, Points.P],
};

// draw faces function:
const drawFace = (pointsArray) => {
  // take 4 coordinate objects & draw based on deconstructed points
  ctx.beginPath();
  ctx.moveTo(pointsArray[0].x, pointsArray[0].y);
  ctx.lineTo(pointsArray[1].x, pointsArray[1].y);
  ctx.lineTo(pointsArray[2].x, pointsArray[2].y);
  ctx.lineTo(pointsArray[3].x, pointsArray[3].y);
  ctx.closePath();

  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
};

// draw mesh function:
const drawMesh = (faceArray) => {
  const topLeft = faceArray[0];
  const topRight = faceArray[1];
  const bottomRight = faceArray[2];
  const bottomLeft = faceArray[3];

  const stepsX = 5;

  const minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
  const maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);

  const moveUp = minY < centreY; // face is above center → move upward

  for (let i = 0; i < stepsX; i++) {
    const t1 = i / stepsX;
    const t2 = (i + 1) / stepsX;

    // interpolate along left edge
    let startLeftX = topLeft.x + (bottomLeft.x - topLeft.x) * t1;
    let startLeftY = topLeft.y + (bottomLeft.y - topLeft.y) * t1;
    let endLeftX = topLeft.x + (bottomLeft.x - topLeft.x) * t2;
    let endLeftY = topLeft.y + (bottomLeft.y - topLeft.y) * t2;

    // interpolate along right edge
    let startRightX = topRight.x + (bottomRight.x - topRight.x) * t1;
    let startRightY = topRight.y + (bottomRight.y - topRight.y) * t1;
    let endRightX = topRight.x + (bottomRight.x - topRight.x) * t2;
    let endRightY = topRight.y + (bottomRight.y - topRight.y) * t2;

    // use animT normally for faces below center,
    // reverse animT for faces above center to move upward
    const effectiveT = moveUp ? 1 - animT : animT;

    let startAnimX = startLeftX + (endLeftX - startLeftX) * effectiveT;
    let startAnimY = startLeftY + (endLeftY - startLeftY) * effectiveT;
    let endAnimX = startRightX + (endRightX - startRightX) * effectiveT;
    let endAnimY = startRightY + (endRightY - startRightY) * effectiveT;

    // clamp to face
    startAnimY = Math.max(minY, Math.min(maxY, startAnimY));
    endAnimY = Math.max(minY, Math.min(maxY, endAnimY));

    // draw horizontal line
    ctx.beginPath();
    ctx.moveTo(startAnimX, startAnimY);
    ctx.lineTo(endAnimX, endAnimY);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }
};

function drawRectangleCube() {
  // draw faces
  Object.values(Faces).forEach((face) => {
    drawFace(face);
  });

  // draw mesh
  Object.values(Faces).forEach((face) => {
    drawMesh(face);
  });
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
