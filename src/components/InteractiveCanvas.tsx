import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseX: number;
  baseY: number;
  size: number;
  alpha: number;
}

interface InteractiveCanvasProps {
  scrollProgress?: number;
  activeSection?: string;
}

export function InteractiveCanvas({ scrollProgress = 0, activeSection = 'hero' }: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / width;
      mouseRef.current.targetY = e.clientY / height;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Generate balanced neural constellation particles
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * width * 1.5;
      const y = (Math.random() - 0.5) * height * 1.5;
      const z = Math.random() * 800 + 200;
      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.005;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 450;

      // Visual adjustments based on active section
      const speedMultiplier = activeSection === 'act' ? 1.6 : activeSection === 'hero' ? 0.8 : 1.1;
      const connectionDist = activeSection === 'understand' ? 140 : 110;

      const projected: { px: number; py: number; scale: number; alpha: number; p: Particle }[] = [];

      // Update and project particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;
        p.z += p.vz * speedMultiplier;

        // Wrap around bounds
        if (p.z < 100) p.z = 1000;
        if (p.z > 1000) p.z = 100;
        if (Math.abs(p.x) > width) p.x = -p.x;
        if (Math.abs(p.y) > height) p.y = -p.y;

        // Subtle camera tilt
        const mouseOffsetX = (mouseRef.current.x - 0.5) * 120;
        const mouseOffsetY = (mouseRef.current.y - 0.5) * 120;

        const rotatedX = p.x - mouseOffsetX;
        const rotatedY = p.y - mouseOffsetY + scrollProgress * 150;
        const rotatedZ = p.z;

        const scale = fov / (fov + rotatedZ);
        const px = centerX + rotatedX * scale;
        const py = centerY + rotatedY * scale;

        if (px >= -50 && px <= width + 50 && py >= -50 && py <= height + 50) {
          projected.push({
            px,
            py,
            scale,
            alpha: p.alpha * Math.min(1, scale * 1.5),
            p,
          });
        }
      }

      // Draw subtle connective filaments
      ctx.lineWidth = 0.75;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * 0.15 * Math.min(projected[i].alpha, projected[j].alpha);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const r = item.p.size * item.scale;

        // Core dot
        ctx.fillStyle = `rgba(255, 255, 255, ${item.alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(item.px, item.py, Math.max(0.6, r), 0, Math.PI * 2);
        ctx.fill();

        // Subtle aura for foreground particles
        if (item.scale > 0.6) {
          ctx.fillStyle = `rgba(255, 255, 255, ${item.alpha * 0.08})`;
          ctx.beginPath();
          ctx.arc(item.px, item.py, r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress, activeSection]);

  return (
    <canvas
      id="acranix-ambient-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
