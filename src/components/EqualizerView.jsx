import { useState } from "react";
import { ToggleSwitch } from "./UIBasicComponents";
import { useAudio } from "../hooks/useAudio"; // <--- 1. Importamos el hook

const EqualizerView = () => {
  // 2. Sacamos las funciones de control del motor de audio
  const { setEqBand, toggleCompressor, toggle3D } = useAudio();

  // Estado para el EQ bypass
  const [eqActive, setEqActive] = useState(true);

  // Estado local solo para la UI del Crossfade (que ya tenías)
  const [crossfadeActive, setCrossfadeActive] = useState(false);
  const [crossfadeValue, setCrossfadeValue] = useState(5);

  // Helper para manejar el cambio en los sliders del EQ
  const handleEqChange = (band, value) => {
    // Tone.js espera decibelios. El slider da strings, convertimos a número.
    setEqBand(band, parseFloat(value));
  };

  // Handler para el toggle master del EQ
  const handleEqToggle = (isActive) => {
    setEqActive(isActive);

    if (isActive) {
      // Restaurar valores por defecto
      setEqBand("low", 3);
      setEqBand("mid", -2);
      setEqBand("high", 5);
    } else {
      // Bypass: Poner todas las bandas a 0 (flat response)
      setEqBand("low", 0);
      setEqBand("mid", 0);
      setEqBand("high", 0);
    }
  };

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl flex-1 flex flex-col p-3 text-on-surface-light dark:text-on-surface-dark">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Ecualizador</h3>
        <ToggleSwitch initialValue={eqActive} onToggle={handleEqToggle} />
      </div>

      <div className="flex-grow space-y-4">
        {" "}
        {/* Un poco más de espacio vertical */}
        {/* --- BANDAS DE EQ --- */}
        {/* Mapeamos los nombres visuales a los nombres técnicos de Tone.js (low, mid, high) */}
        {[
          { label: "Graves", band: "low", default: 3 },
          { label: "Medios", band: "mid", default: -2 },
          { label: "Agudos", band: "high", default: 5 },
        ].map((item) => (
          <div key={item.band} className="flex flex-col">
            <label className="text-sm font-medium text-on-surface-variant-light dark:text-on-surface-variant-dark">
              {item.label}
            </label>
            <div className="relative flex items-center">
              <span className="text-xs text-on-surface-variant-light">-12</span>
              <input
                className="w-full mx-2 accent-primary" // accent-primary ayuda en algunos navegadores
                max="12"
                min="-12"
                step="0.1" // Pasos más suaves
                type="range"
                defaultValue={item.default}
                onChange={(e) => handleEqChange(item.band, e.target.value)} // <--- Conectado aquí
              />
              <span className="text-xs text-on-surface-variant-light">+12</span>
            </div>
          </div>
        ))}
        {/* --- CROSSFADE (Tu lógica visual) --- */}
        <div className="flex flex-col pt-2 border-t border-gray-100 dark:border-gray-800">
          {/* Usamos el ToggleSwitch arreglado */}
          <ToggleSwitch
            label="Crossfade"
            initialValue={crossfadeActive}
            onToggle={(val) => setCrossfadeActive(val)}
          />

          {crossfadeActive && (
            <div className="relative flex items-center mt-2 animate-fade-in">
              <span className="text-xs text-on-surface-variant-light w-4">
                1s
              </span>
              <input
                className="w-full mx-2 accent-primary"
                max="10"
                min="1"
                type="range"
                value={crossfadeValue}
                onChange={(e) => setCrossfadeValue(e.target.value)}
              />
              <span className="text-xs text-on-surface-variant-light w-6 text-right">
                {crossfadeValue}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* --- EFECTOS EXTRA --- */}
      <div className="flex justify-between items-center pb-4 pt-2">
        <div className="flex flex-col items-center gap-1 w-1/2 pr-2">
          {/* Conectamos el Compresor */}
          <ToggleSwitch
            label="Compressor"
            initialValue={false}
            onToggle={(isActive) => toggleCompressor(isActive)}
          />
        </div>
        <div className="flex flex-col items-center gap-1 w-1/2 pl-2">
          {/* Conectamos el Audio 3D */}
          <ToggleSwitch
            label="3D Audio"
            initialValue={false}
            onToggle={(isActive) => toggle3D(isActive)}
          />
        </div>
      </div>
    </div>
  );
};

export default EqualizerView;
