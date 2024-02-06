import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { magicButton } from './counter.ts'
import { noise } from './perlin.ts'

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
  <canvas id="canvas"></canvas>

`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
magicButton(document.querySelector<HTMLButtonElement>('#magic')!)

console.log(noise(0.1, 2.3, 3.0932))

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const scale = 5;

const width = 200;
const height = 200;

canvas.width = width;
canvas.height = height;
var x = 0;
var y = 0;

while (x < width - 5) {
  while (y < height - 5) {
    const value = noise(x / 10, y / 10, 0)
    ctx.fillStyle = `rgb(${value * 255}, ${value * 255}, ${value * 255})`;
    ctx.fillRect(x * scale, y * scale, scale, scale);
    y += scale;
    console.log(y);
  }
  y = 0;
  x += scale;
}


for (let x = 0; x < width; x += scale) {
  for (let y = 0; y < height; y += scale) {
    const value = noise(x / 10, y / 10, 0);
    ctx.fillStyle = `rgb(${value * 255}, ${value * 255}, ${value * 255})`;
    ctx.fillRect(x, y, scale, scale);
  }
}
