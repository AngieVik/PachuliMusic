import { useContext } from 'react';
import { AudioContext } from '../context/AudioContextDefinition'; // Ruta actualizada

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio debe usarse dentro de AudioProvider");
  }
  return context;
};