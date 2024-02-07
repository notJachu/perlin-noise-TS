import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { magicButton } from './counter.ts'
import { noise } from './perlin.ts'
import { Noise2D } from './alt.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>

      <button id="magic" type="button">Magic button</button>
  </div>
  <canvas id="canvas" width="300" height="300"></canvas>

`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
magicButton(document.querySelector<HTMLButtonElement>('#magic')!)

console.log(noise(0.1, 2.3, 3.0932))

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const scale = 5;

const width = 300;
const height = 300;

canvas.width = width;
canvas.height = height;
var x = 0.2;
var y = 0.2;

var inc = 0.05;
var xoff = 0.1;
var yoff = 0.1;
var zoff = 0.1;

var image = ctx.createImageData(canvas.width, canvas.height);
var data = image.data;

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


console.log(noise(1.1,4.4,0))