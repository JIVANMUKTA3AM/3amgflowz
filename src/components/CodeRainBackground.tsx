
import React, { useEffect, useRef } from 'react';

const CodeRainBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Código para criar o efeito de chuva de código
    const codeChars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{}[]()+-*/=<>?:;.,|\\~`!@#$%^&_';
    const fontSize = 14;
    let columns: number;
    let drops: number[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };

    const draw = () => {
      // Overlay escuro semi-transparente para criar o efeito de fade
      ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#FF6B35'; // Cor laranja da 3AMG
      ctx.font = `${fontSize}px 'Courier New', monospace`;

      // Desenhar os caracteres caindo
      for (let i = 0; i < drops.length; i++) {
        const text = codeChars[Math.floor(Math.random() * codeChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = `rgba(255, 107, 53, ${Math.random() * 0.8 + 0.2})`; // Opacidade mais visível
        ctx.fillText(text, x, y);

        // Reset da gota se chegou ao final ou aleatoriamente
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Inicializar
    resizeCanvas();
    
    // Animar
    const interval = setInterval(draw, 50); // Velocidade mais rápida

    // Redimensionar quando a janela mudar
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ background: 'transparent' }}
    />
  );
};

export default CodeRainBackground;
