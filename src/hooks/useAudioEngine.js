import { useEffect, useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';
import { usePlayerStore } from '../store/usePlayerStore';

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
  const [currentTime, setCurrentTime] = useState(0);
  
  const { isPlaying, setIsPlaying, volume } = usePlayerStore();

  // 1. Inicializar Grafo - Hardened for Strict Mode
  useEffect(() => {
    let isMounted = true;

    const initAudio = async () => {
      if (player.current) return;

      const p = new Tone.Player();
      const e = new Tone.EQ3(0, 0, 0); 
      const c = new Tone.Compressor(-30, 3);
      const w = new Tone.StereoWidener(0.5); 
      const cf = new Tone.CrossFade(0); 
      const a = new Tone.Analyser('fft', 256);

      // FIX: Conexión correcta de CrossFade
      // Cadena de efectos hasta widener
      p.disconnect();
      p.chain(e, c, w);
      
      // Conexión manual a la entrada A del Crossfade
      w.connect(cf.a);
      
      // Salida del Crossfade a Destination
      cf.toDestination();
      
      // Analyser conectado al widener
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
      player.current?.dispose();
      eq.current?.dispose();
      compressor.current?.dispose();
      widener.current?.dispose();
      crossFade.current?.dispose();
      analyser.current?.dispose();

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
           const now = Tone.now();
           const elapsed = now - startTimeRef.current;
           const total = offsetRef.current + elapsed;
           
           if (total <= duration) {
               setCurrentTime(total);
               animationFrameId = requestAnimationFrame(loop);
           } else {
               setCurrentTime(duration);
               setIsPlaying(false);
           }
        }
     };

     if (isPlaying) {
        loop();
     } else {
        cancelAnimationFrame(animationFrameId);
     }

     return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, duration, setIsPlaying]);

  // 3. Cargar Canción - RAM-based (sin IndexedDB)
  const loadTrack = useCallback(async (track) => {
    console.log('🎵 loadTrack called with:', track?.title);
    
    if (!player.current) {
      console.error('❌ Player not initialized');
      return;
    }
    
    // Detener anterior
    if (player.current.state === 'started') {
        console.log('⏹️ Stopping previous track');
        player.current.stop();
    }
    
    await Tone.start(); 
    console.log('✅ Tone.start() completed');

    // FIX: Usar el archivo directamente desde RAM (track.file)
    let url;
    if (track.file) {
        url = URL.createObjectURL(track.file);
        console.log('📁 Created ObjectURL from file');
    } else if (track.url) {
        url = track.url;
        console.log('🌐 Using external URL');
    } else {
        console.error('❌ No file or URL available for track:', track);
        return;
    }

    if (url) {
        console.log('⏳ Loading audio buffer...');
        await player.current.load(url);
        console.log('✅ Audio buffer loaded');
        
        const dur = player.current.buffer.duration;
        setDuration(dur);
        setCurrentTime(0);
        offsetRef.current = 0;
        
        startTimeRef.current = Tone.now();
        player.current.start();
        setIsPlaying(true);
        
        // Track this play in history
        const { trackPlay } = usePlayerStore.getState();
        trackPlay(track);
        
        console.log('▶️ Playback started, duration:', dur.toFixed(2), 's');
    }
  }, [setIsPlaying]);

  // AUTO-LOAD: Observar cambios en cola y cargar automáticamente
  const { queue, currentTrackIndex } = usePlayerStore();
  
  useEffect(() => {
    const currentTrack = queue[currentTrackIndex];
    
    if (currentTrack && isReady && player.current) {
      console.log('🔄 Track changed, auto-loading:', currentTrack.title);
      loadTrack(currentTrack);
    }
  }, [queue, currentTrackIndex, isReady, loadTrack]);

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
  const toggle3D = (active) => { 
      if(widener.current) {
          // Si está activo: 0.8 (Efecto 3D Amplio)
          // Si está apagado: 0.5 (Estéreo Normal / Original)
          // NUNCA pongas 0, porque eso es Mono.
          widener.current.width.value = active ? 0.8 : 0.5; 
      }
  };
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