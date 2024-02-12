import './style.css'
import { noise } from './perlin.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <canvas id="canvas" width="300" height="300"></canvas>

`

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const scale = 3;

const width = 300;
const height = 300;

canvas.width = width;
canvas.height = height;

var inc = 0.05;
var xoff = 0.1;
var yoff = 0.1;
var zoff = 0.1;


function drawFrame(){
  for (let x = 0; x < width; x += scale) {
    for (let y = 0; y < height; y += scale) {
      let value = noise(xoff, yoff, zoff);
      //let value = Noise2D(xoff, yoff);
      value = (value + 1) / 2;
      //console.log(value);
      ctx.fillStyle = `rgb(${value * 255}, ${value * 255}, ${value * 255})`;
      ctx.fillRect(x, y, scale, scale);
      yoff += inc;
    }
    xoff += inc;
    yoff = 0;
  }
  xoff = 0;
  zoff += inc;
}

const fps = 30; // Frames per second
const frameTime = 1000 / fps; // Time per frame in milliseconds

let lastFrameTime = performance.now();

function animate() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastFrameTime;

  if (deltaTime >= frameTime) {
    // Render the frame
    drawFrame();

    lastFrameTime = currentTime;
  }

  requestAnimationFrame(animate);
}

animate();
