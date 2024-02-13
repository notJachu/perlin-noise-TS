import './style.css'
import { noise } from './perlin.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <canvas id="canvas" width="1920" height="1080"></canvas>

`

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const scale = 25;

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
    this.prevPos = new vec2(x, y);
  }

  update() {
    const vMax = 5;
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    this.vel.add(this.acc);
    this.vel.x = Math.min(Math.max(this.vel.x, -vMax), vMax);
    this.vel.y = Math.min(Math.max(this.vel.y, -vMax), vMax);
    this.pos.add(this.vel);
    this.acc = new vec2(0, 0);
  }

  wrap() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos.x = this.pos.x;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos.x = this.pos.x;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos.y = this.pos.y;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos.y = this.pos.y;
    }
  }

  applyForce(force: vec2) {
    this.acc.add(force);
  }

  followField() {
    let x = Math.floor(this.pos.x / scale); // get the grid position
    let y = Math.floor(this.pos.y / scale);
    //let angle = noise(this.pos.x, this.pos.y, zoff) * Math.PI * 2; // get the angle from the noise
    let angle = (noise(x * xoff, y * xoff, zoff) + 1) * Math.PI; // get the angle from the noise
    let v = vec2.prototype.fromAngle(angle);
    v.x *= 0.5;
    v.y *= 0.5;
    //console.log(v);
    // console.log(x, y);
    
    this.applyForce(v);
    // ctx.beginPath();
    // ctx.moveTo(this.pos.x, this.pos.y);
    // ctx.lineTo(this.pos.x + v.x * scale, this.pos.y + v.y * scale);
    // ctx.stroke();
    // ctx.closePath();
  }

  draw() {
    ctx.strokeStyle = `rgba(0, 0, 0, 0.01)`; // Set stroke color with reduced alpha
    ctx.beginPath();
    ctx.moveTo(this.prevPos.x, this.prevPos.y);
    ctx.lineTo(this.pos.x, this.pos.y);
    ctx.stroke();
      // console.log(this.pos.x, this.pos.y);
      // console.log(" ");
      // console.log(this.prevPos.x, this.prevPos.y);
    ctx.closePath();
    // ctx.fillStyle = 'black';
    // ctx.fillRect(this.pos.x, this.pos.y, 5, 5);
  }

}
// no need to compute full field can only compute the field for the particle
var particles:particle[] = [];
for (let i = 0; i < 5000 ; i++) {
  particles.push(new particle(Math.random() * width, Math.random() * height));
}

function drawField() {
  for (let x = 0; x <= width; x += scale) {
    for (let y = 0; y <= height; y += scale) {
      let value = noise(xoff, yoff, zoff);
      value = (value + 1) / 2;
      //ctx.fillStyle = `rgb(${value * 255}, ${value * 255}, ${value * 255})`;
      //ctx.fillRect(x, y, scale, scale);
      let v = vec2.prototype.fromAngle(value * Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(x  , y  );
      ctx.lineTo(x   + v.x * scale , y   + v.y * scale );
      ctx.stroke();
      ctx.closePath();
      //ctx.fillRect(x + scale, y + scale, 5, 5);
      //ctx.fillRect(x, y , 5 , 5);
      yoff += inc;
    }
    xoff += inc;
    yoff = 0;
  }
  xoff = 0;
  zoff += 0.005;
}

function drawFrame(){
  // ctx.clearRect(0, 0, width, height);
  particles.forEach(particle => {
    particle.followField();
    particle.update();
    particle.wrap();
    particle.draw();
  });
  //drawField();
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
