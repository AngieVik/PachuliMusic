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
  const [currentTime, setCurrentTime] = useState(0); // Nuevo estado para UI
  
  // Extraemos VOLUME e isPlaying para usarlos y devolverlos
  const { isPlaying, setIsPlaying, volume } = usePlayerStore();

  // 1. Inicializar Grafo - Hardened for Strict Mode
  useEffect(() => {
    // Flag para evitar doble inicialización en Strict Mode
    let isMounted = true;

    const initAudio = async () => {
      // Si ya existe una instancia (por hot reload o strict mode), limpiarla antes
      if (player.current) return;

      const p = new Tone.Player().toDestination();
      const e = new Tone.EQ3(0, 0, 0); 
      const c = new Tone.Compressor(-30, 3);
      const w = new Tone.StereoWidener(0.5); 
      const cf = new Tone.CrossFade(0); 
      const a = new Tone.Analyser('fft', 256);

      p.disconnect();
      p.chain(e, c, w, cf, Tone.Destination);
      w.connect(a);

      if (isMounted) {
        player.current = p;
        eq.current = e;
        compressor.current = c;
        widener.current = w;
        crossFade.current = cf;
        analyser.current = a;
        
        setIsReady(true);
      } else {
        // Si se desmontó mientras cargaba, limpiar inmediatamente
        p.dispose();
        e.dispose();
        c.dispose();
        w.dispose();
        cf.dispose();
        a.dispose();
      }
    };

    initAudio();
    
    return () => {
      isMounted = false;
      // Limpieza robusta al desmontar
      player.current?.dispose();
      eq.current?.dispose();
      compressor.current?.dispose();
      widener.current?.dispose();
      crossFade.current?.dispose();
      analyser.current?.dispose();

      // Reset refs
      player.current = null;
      eq.current = null;
      compressor.current = null;
      widener.current = null;
      crossFade.current = null;
      analyser.current = null;
    };
  }, []);

  // 2. Efecto para controlar el VOLUMEN en tiempo real
  useEffect(() => {
      if (player.current) {
          player.current.volume.value = volume === 0 ? -Infinity : 20 * Math.log10(volume);
      }
  }, [volume, isReady]);



  // Ref de tiempo para sincronización
  const startTimeRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
     let animationFrameId;

     const loop = () => {
        if (isPlaying && player.current) {
           // Tiempo actual = Tiempo transcurrido desde start + offset inicial
           const now = Tone.now();
           const elapsed = now - startTimeRef.current;
           const total = offsetRef.current + elapsed;
           
           // Limitar a duración
           if (total <= duration) {
               setCurrentTime(total);
               animationFrameId = requestAnimationFrame(loop);
           } else {
               setCurrentTime(duration);
               setIsPlaying(false); // Fin de canción
           }
        }
     };

     if (isPlaying) {
        // Al dar play, seteamos el punto de referencia
        // PERO esto asume que acabamos de dar play. 
        // Si ya veniamos tocando... el effect corre al cambiar isPlaying.
        // Necesitamos capturar el Tone.now() ALMOMENTO de start().
        // Lo haremos en togglePlayback/seek.
        
        // Solo iniciamos el loop de UI
        loop();
     } else {
        cancelAnimationFrame(animationFrameId);
     }

     return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, duration, setIsPlaying]);


  // 3. Cargar Canción
  const loadTrack = useCallback(async (track) => {
    if (!player.current) return;
    
    // Detener anterior
    if (player.current.state === 'started') {
        player.current.stop();
    }
    
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
        // await player.current.loaded; // load es async en nuevas versiones o retorna promise
        
        const dur = player.current.buffer.duration;
        setDuration(dur);
        setCurrentTime(0);
        offsetRef.current = 0; // Reset offset on new track
        
        startTimeRef.current = Tone.now(); // Mark start time
        player.current.start();
        setIsPlaying(true);
    }
  }, [setIsPlaying]);

  // Controles
  const togglePlayback = () => {
    if (!player.current || !player.current.loaded) return;
    
    if (player.current.state === 'started') {
      // PAUSA
      player.current.stop(); 
      
      // Guardar donde nos quedamos
      const now = Tone.now();
      const elapsed = now - startTimeRef.current;
      offsetRef.current += elapsed; // Acumular lo reproducido
      
      setIsPlaying(false);
    } else {
      // PLAY
      // Reanudar desde offset
      // offsetRef.current tiene el punto donde pausamos
      const now = Tone.now();
      startTimeRef.current = now; // Nuevo punto de referencia temporal
      
      player.current.start(undefined, offsetRef.current); 
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    if (player.current && player.current.loaded) {
      // Stop si está sonando para reiniciar desde nuevo punto
      const wasPlaying = player.current.state === 'started';
      if (wasPlaying) player.current.stop();
      
      offsetRef.current = time; // Nuevo punto base
      setCurrentTime(time); // Actualizar UI inmediato
      
      if (wasPlaying || isPlaying) {
          startTimeRef.current = Tone.now();
          player.current.start(undefined, time);
          if (!isPlaying) setIsPlaying(true);
      }
    }
  };

  const setEqBand = (band, value) => { if (eq.current) eq.current[band].value = value; };
  const toggleCompressor = (active) => { if(compressor.current) compressor.current.threshold.value = active ? -30 : 0; };
  const toggle3D = (active) => { if(widener.current) widener.current.width.value = active ? 0.8 : 0; };
  const getAnalyser = () => analyser.current;

  return {
    isReady,
    duration,
    currentTime, // Estado reactivo real
    loadTrack,
    togglePlayback,
    seek,
    setEqBand,
    toggleCompressor,
    toggle3D,
    getAnalyser,
    getCurrentTime: () => currentTime, // Helper legacy
    isPlaying,
    playerRef: player
  };
};