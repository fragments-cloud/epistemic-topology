'use client';

import React, { useState, useEffect, useRef } from 'react';

const EpistemicTopologySimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();

  // Parâmetros da simulação
  const knowledgePoints = useRef<Array<{
    x: number;
    y: number;
    intensity: number;
    created: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    // Inicializar com um ponto de conhecimento no centro
    knowledgePoints.current = [{
      x: canvas.width / 2,
      y: canvas.height / 2,
      intensity: 1.0,
      created: 0
    }];

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startSimulation = () => {
    setIsRunning(true);
    setTime(0);
    knowledgePoints.current = [{
      x: 300,
      y: 200,
      intensity: 1.0,
      created: 0
    }];
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Atualizar tempo
    setTime(prev => prev + 0.1);

    // Adicionar novos pontos de conhecimento periodicamente
    if (Math.random() < 0.02 && knowledgePoints.current.length < 20) {
      knowledgePoints.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        intensity: 0.3 + Math.random() * 0.7,
        created: time
      });
    }

    // Atualizar e desenhar pontos
    knowledgePoints.current.forEach((point, index) => {
      const age = time - point.created;
      const radius = Math.min(50, age * 10);

      // Criar gradiente radial
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );

      const alpha = Math.max(0.1, point.intensity * (1 - age * 0.01));
      gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(59, 130, 246, ${alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(15, 23, 42, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Desenhar conexões entre pontos próximos
      knowledgePoints.current.forEach((otherPoint, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow(point.x - otherPoint.x, 2) + Math.pow(point.y - otherPoint.y, 2)
          );

          if (distance < 100) {
            const connectionAlpha = Math.max(0, (100 - distance) / 100 * 0.3);
            ctx.strokeStyle = `rgba(139, 92, 246, ${connectionAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.stroke();
          }
        }
      });
    });

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isRunning) {
      animate();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, time]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-lg shadow-2xl border border-purple-500/20">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-4">
          Simulação Interativa: Propagação de Conhecimento
        </h3>
        <p className="text-purple-200 mb-4">
          Visualização em tempo real da difusão de conhecimento no espaço-tempo
        </p>
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Iniciar Simulação
          </button>
          <button
            onClick={stopSimulation}
            disabled={!isRunning}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Parar
          </button>
        </div>
        <div className="text-sm text-purple-300">
          Tempo: {time.toFixed(1)}s | Pontos ativos: {knowledgePoints.current.length}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-96 border border-purple-500/30 rounded-lg bg-slate-900"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>🔵 Pontos de conhecimento se expandem e se conectam</p>
          <p>🟣 Gradientes mostram intensidade e propagação temporal</p>
        </div>
      </div>
    </div>
  );
};

export default EpistemicTopologySimulation;