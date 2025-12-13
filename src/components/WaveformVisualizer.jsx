import { useEffect, useRef } from "react";
import { useAudio } from "../hooks/useAudio";

const WaveformVisualizer = () => {
  const canvasRef = useRef(null);
  const { getAnalyser, isReady } = useAudio();

  useEffect(() => {
    if (!isReady || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = getAnalyser(); // Obtenemos el nodo Tone.Analyser
    let animationId;

    const renderFrame = () => {
      // Obtenemos datos de frecuencia (FFT)
      const values = analyser.getValue();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Configuración de dibujo (Color primario)
      ctx.fillStyle = "#13ec5b";

      const barWidth = width / values.length;

      // Dibujar barras
      values.forEach((v, i) => {
        // v viene en decibelios (-100 a 0 aprox). Lo normalizamos para altura.
        const barHeight = (v + 140) * 2;
        const x = i * barWidth;

        // Centrar verticalmente como en el diseño original
        ctx.fillRect(x, (height - barHeight) / 2, barWidth - 1, barHeight);
      });

      animationId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => cancelAnimationFrame(animationId);
  }, [isReady, getAnalyser]);

  return (
    <div className="w-full gap-1 overflow-hidden rounded-xl aspect-square flex items-center justify-center shadow-neumorphic-light dark:shadow-neumorphic-dark bg-surface-light dark:bg-surface-dark p-6">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full h-full rounded-lg"
      />
    </div>
  );
};

export default WaveformVisualizer;
