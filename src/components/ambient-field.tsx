import { useEffect, useRef } from 'react';

export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 800px)').matches;
    const particleCount = mobile ? 7 : 15;
    let animationFrame = 0;
    let isVisible = true;
    const particles = Array.from({ length: particleCount }, (_, index) => ({
      x: (index * 83) % window.innerWidth,
      y: 110 + ((index * 127) % Math.max(window.innerHeight - 180, 300)),
      radius: index % 4 === 0 ? 1.5 : 0.8,
      drift: 0.12 + (index % 3) * 0.03,
      phase: index * 1.7,
    }));
    const context = canvas.getContext('2d');
    if (!context) return;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const paint = (time: number) => {
      if (!isVisible) return;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((particle) => {
        const movement = reduced ? 0 : Math.sin(time * 0.0005 * particle.drift + particle.phase) * 5;
        const alpha = 0.15 + (Math.sin(time * 0.0007 + particle.phase) + 1) * 0.08;
        context.beginPath();
        context.arc(particle.x + movement, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(247, 181, 103, ${reduced ? 0.16 : alpha})`;
        context.fill();
      });
      if (!reduced && !mobile) animationFrame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible && animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = 0; }
      else if (isVisible && !reduced && !mobile && !animationFrame) animationFrame = requestAnimationFrame(paint);
    });
    observer.observe(canvas);
    resize();
    window.addEventListener('resize', resize);
    if (reduced || mobile) paint(0); else animationFrame = requestAnimationFrame(paint);
    return () => { cancelAnimationFrame(animationFrame); observer.disconnect(); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas aria-hidden="true" className="ambient-canvas" ref={canvasRef} />;
}
