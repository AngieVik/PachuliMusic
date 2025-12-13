import { useEffect, useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';
import { usePlayerStore } from '../store/usePlayerStore';
import { getAudioFile } from '../utils/db';

export const useAudioEngine = () => {
  // Referencias a nodos de audio
  const player = useRef(null);
  const eq = useRef(null);
  const compressor = useRef(null);
  const widener = useRef(null);
  const crossFade = useRef(null);
  const analyser = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0); 
  
  // Extraemos VOLUME para usarlo, y quitamos isPlaying que no usabamos aquí
  const { setIsPlaying, volume } = usePlayerStore();

  // 1. Inicializar Grafo
  useEffect(() => {
    const initAudio = async () => {
      player.current = new Tone.Player().toDestination();
      eq.current = new Tone.EQ3(0, 0, 0); 
      compressor.current = new Tone.Compressor(-30, 3);
      widener.current = new Tone.StereoWidener(0.5); 
      crossFade.current = new Tone.CrossFade(0); 
      analyser.current = new Tone.Analyser('fft', 256);

      player.current.disconnect();
      player.current.chain(
        eq.current,
        compressor.current,
        widener.current,
        crossFade.current,
        Tone.Destination
      );
      widener.current.connect(analyser.current);

      setIsReady(true);
    };
    initAudio();
    
    return () => {
        player.current?.dispose();
        eq.current?.dispose();
        compressor.current?.dispose();
        widener.current?.dispose();
        crossFade.current?.dispose();
        analyser.current?.dispose();
    };
  }, []);

  // 2. Efecto para controlar el VOLUMEN en tiempo real
  useEffect(() => {
      if (player.current) {
          // Tone.js usa decibelios. Convertimos de 0-1 a dB.
          // 0 = Mute (-Infinity dB), 1 = 0 dB (volumen total)
          player.current.volume.value = volume === 0 ? -Infinity : 20 * Math.log10(volume);
      }
  }, [volume]);

  // 3. Cargar Canción
  const loadTrack = useCallback(async (track) => {
    if (!player.current) return;
    
    if(player.current.state === 'started') player.current.stop();
    
    await Tone.start(); 

    let url;
    if (track.isLocal) {
        const blob = await getAudioFile(track.id);
        if (blob) url = URL.createObjectURL(blob);
    } else {
        url = track.url;
    }

    if (url) {
        await player.current.load(url);
        setDuration(player.current.buffer.duration);
        player.current.start();
        setIsPlaying(true);
    }
  }, [setIsPlaying]);

  // Controles
  const togglePlayback = () => {
    if (!player.current || !player.current.loaded) return;
    if (player.current.state === 'started') {
      player.current.stop(); 
      setIsPlaying(false);
    } else {
      player.current.start(undefined, player.current.toSeconds(Tone.now())); 
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    if (player.current && player.current.loaded) {
      player.current.seek(time);
    }
  };

  const getCurrentTime = () => {
      if(player.current && player.current.loaded && player.current.state === 'started') {
          // Aproximación segura para UI
          return player.current.toSeconds(Tone.now()); 
      } 
      return 0;
  };

  const setEqBand = (band, value) => { if (eq.current) eq.current[band].value = value; };
  const toggleCompressor = (active) => { if(compressor.current) compressor.current.threshold.value = active ? -30 : 0; };
  const toggle3D = (active) => { if(widener.current) widener.current.width.value = active ? 0.8 : 0; };
  const getAnalyser = () => analyser.current;

  return {
    isReady,
    duration,
    loadTrack,
    togglePlayback,
    seek,
    setEqBand,
    toggleCompressor,
    toggle3D,
    getAnalyser,
    getCurrentTime, // ¡Añadido! Ahora sí se exporta
    playerRef: player
  };
};