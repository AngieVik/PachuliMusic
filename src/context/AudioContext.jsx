import { useAudioEngine } from "../hooks/useAudioEngine";
import { AudioContext } from "./AudioContextDefinition"; // Importamos del nuevo archivo

export const AudioProvider = ({ children }) => {
  const audioInterface = useAudioEngine();

  return (
    <AudioContext.Provider value={audioInterface}>
      {children}
    </AudioContext.Provider>
  );
};
