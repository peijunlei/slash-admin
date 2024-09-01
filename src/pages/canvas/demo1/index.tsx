import { useEffect } from 'react';
import styled from 'styled-components';

import { getRandomHslColor } from '@/utils';

const Wrapper = styled.div`
  #canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #000;
  }
`;
class Effect {
  canvas: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  canvasWidth: number;

  canvasHeight: number;

  maxCount: number;

  particles: Particle[];

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.maxCount = 100;
    this.particles = [];
    this.generateParticles();
    window.onresize = () => {
      this.canvasWidth = window.innerWidth;
      this.canvasHeight = window.innerHeight;
    };
  }

  handleParticles() {
    this.particles.forEach((particle) => {
      particle.render();
    });
  }

  generateParticles() {
    for (let i = 0; i < this.maxCount; i++) {
      this.particles.push(new Particle(this));
    }
  }

  connetcParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.particles[i].color;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  }
}
class Particle {
  x: number;

  y: number;

  vx: number;

  vy: number;

  radius: number;

  color: string;

  effect: Effect;

  ctx: CanvasRenderingContext2D;

  gradient: CanvasGradient;

  constructor(effect: Effect) {
    this.effect = effect;
    this.ctx = effect.ctx;
    this.radius = 5 + Math.random() * 5;

    this.x = this.radius + Math.random() * (this.effect.canvasWidth - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.canvasHeight - this.radius * 2);
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 - 2;
    this.color = getRandomHslColor();
    this.gradient = this.ctx.createLinearGradient(
      this.x,
      this.y,
      this.effect.canvasWidth,
      this.effect.canvasHeight,
    );
    this.gradient.addColorStop(0.3, 'red');
    this.gradient.addColorStop(0.5, 'yellow');
    this.gradient.addColorStop(0.7, 'green');
    this.ctx.fillStyle = this.gradient;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.radius > this.effect.canvasWidth || this.x < this.radius) {
      this.vx = -this.vx;
    }

    if (this.y + this.radius > this.effect.canvasHeight || this.y < this.radius) {
      this.vy = -this.vy;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  render() {
    this.update();
    this.draw();
  }
}

function Demo1() {
  useEffect(() => {
    const effect = new Effect();

    function animate() {
      effect.ctx.clearRect(0, 0, effect.canvasWidth, effect.canvasHeight);
      effect.handleParticles();
      effect.connetcParticles();
      requestAnimationFrame(animate);
    }
    animate();
  }, []);
  return (
    <Wrapper>
      <canvas id="canvas" width="200" height="100" />
    </Wrapper>
  );
}

export default Demo1;
