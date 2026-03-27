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

// define all face coordinates (reference diagram at top)
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

const Zones = {
  Zone1: [Points.A, Points.B, Points.E, Points.D],
  Zone2: [Points.B, Points.C, Points.F, Points.E],
  Zone3: [Points.A, Points.D, Points.H, Points.G],
  Zone4: [Points.D, Points.E, Points.I, Points.H],
  Zone5: [Points.E, Points.F, Points.J, Points.I],
  Zone6: [Points.F, Points.C, Points.K, Points.J],
  Zone7: [Points.G, Points.H, Points.L, Points.O],
  Zone8: [Points.H, Points.I, Points.M, Points.L],
  Zone9: [Points.I, Points.J, Points.N, Points.M],
  Zone10: [Points.J, Points.K, Points.Q, Points.N],
  Zone11: [Points.L, Points.M, Points.P, Points.O],
  Zone12: [Points.M, Points.N, Points.Q, Points.P],
};

// show points
Object.values(Points).forEach((point) => {
  const { x, y } = point;

  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "limegreen";
  ctx.fill();
});

// set global animation value
let animT = 0;

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

// draw faces
Object.values(Zones).forEach((zone) => {
  drawFace(zone);
});

// draw mesh function:
// take one of the faces & deconstruct
// define number of mesh lines
