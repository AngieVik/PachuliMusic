import { useState } from "react";
import { ToggleSwitch } from "./UIBasicComponents";

const EqualizerView = () => {
  const [crossfadeActive, setCrossfadeActive] = useState(false);
  const [crossfadeValue, setCrossfadeValue] = useState(5);

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl flex-1 flex flex-col p-3 text-on-surface-light dark:text-on-surface-dark">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Ecualizador</h3>
        <ToggleSwitch initialValue={true} />
      </div>
      <div className="flex-grow space-y-2">
        {["Graves", "Medios", "Agudos"].map((label, i) => (
          <div key={label} className="flex flex-col">
            <label className="text-sm font-medium text-on-surface-variant-light dark:text-on-surface-variant-dark">
              {label}
            </label>
            <div className="relative flex items-center">
              <span className="text-xs text-on-surface-variant-light">-12</span>
              <input
                className="w-full mx-2"
                max="12"
                min="-12"
                type="range"
                defaultValue={i === 0 ? 3 : i === 1 ? -2 : 5}
              />
              <span className="text-xs text-on-surface-variant-light">+12</span>
            </div>
          </div>
        ))}
        <div className="flex flex-col pt-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-on-surface-variant-light dark:text-on-surface-variant-dark">
              Crossfade
            </label>
            <div
              onClick={() => setCrossfadeActive(!crossfadeActive)}
              className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${
                crossfadeActive ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white dark:bg-surface-light shadow transform transition-transform ${
                  crossfadeActive ? "translate-x-5" : ""
                }`}
              ></div>
            </div>
          </div>
          {crossfadeActive && (
            <div className="relative flex items-center">
              <span className="text-xs text-on-surface-variant-light w-4">
                1s
              </span>
              <input
                className="w-full mx-2"
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
      <div className="flex justify-between items-center pb-4">
        <div className="flex flex-col items-center gap-1">
          <ToggleSwitch label="Compressor" initialValue={false} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <ToggleSwitch label="3D Audio" initialValue={false} />
        </div>
      </div>
    </div>
  );
};
export default EqualizerView;
