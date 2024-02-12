import './style.css'
import { noise } from './perlin.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <canvas id="canvas" width="1920" height="1080"></canvas>

`

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const scale = 20;

const width = 500;
const height = 500;

canvas.width = width;
canvas.height = height;

var inc = 0.05;
var xoff = 0.1;
var yoff = 0.1;
var zoff = 0.1;

class vec2 {
 
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  fromAngle(angle: number) {
    return new vec2(Math.cos(angle), Math.sin(angle));
  }

  add(v: vec2) {
    this.x += v.x;
    this.y += v.y;
  }
}

class particle {
  pos: vec2;
  vel: vec2;
  acc: vec2;
  prevPos: vec2;

  constructor(x: number, y: number) {
    this.pos = new vec2(x, y);
    this.vel = new vec2(0, 0);
    this.acc = new vec2(0, 0);
    this.prevPos = this.pos;
  }

  update() {
    this.prevPos = this.pos;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc = new vec2(0, 0);
  }

  wrap() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos = this.pos;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos = this.pos;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos = this.pos;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos = this.pos;
    }
  }

  applyForce(force: vec2) {
    this.acc.add(force);
  }

  findForce() {
    
  }

  draw() {
    // ctx.beginPath();
    // ctx.moveTo(this.prevPos.x, this.prevPos.y);
    // ctx.lineTo(this.pos.x, this.pos.y);
    // ctx.stroke();
    // ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fillRect(this.pos.x, this.pos.y, 5, 5);
  }

}

var particles:particle[] = [];
particles.push(new particle(0, 0));

function drawFrame(){
  ctx.clearRect(0, 0, width, height);
  particles[0].draw();
  particles[0].update();
  for (let x = 0; x < width; x += scale) {
    for (let y = 0; y < height; y += scale) {
      let value = noise(xoff, yoff, zoff);
      value = (value + 1) / 2;
      //ctx.fillStyle = `rgb(${value * 255}, ${value * 255}, ${value * 255})`;
      //ctx.fillRect(x, y, scale, scale);
      let v = vec2.prototype.fromAngle(value * Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(x + scale , y + scale );
      ctx.lineTo(x + scale  + v.x * scale , y + scale  + v.y * scale );
      ctx.stroke();
      ctx.closePath();
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
