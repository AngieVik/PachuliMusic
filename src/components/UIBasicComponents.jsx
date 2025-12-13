import { useState } from "react";

export const NeumorphicButton = ({
  children,
  onClick,
  className = "",
  type = "button",
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`flex items-center justify-center rounded-full text-on-surface-light dark:text-on-surface-dark shadow-neumorphic-light dark:shadow-neumorphic-dark active:shadow-neumorphic-inset-light dark:active:shadow-neumorphic-inset-dark ${className}`}
  >
    {children}
  </button>
);

// Busca la función ToggleSwitch y déjala así:
export const ToggleSwitch = ({ label, initialValue, onToggle }) => {
  // <--- Agregamos onToggle
  const [on, setOn] = useState(initialValue);

  const handleClick = () => {
    const newState = !on;
    setOn(newState);
    if (onToggle) onToggle(newState); // <--- Si nos pasan una función, la avisamos
  };

  return (
    <div className="flex justify-between items-center">
      {label && (
        <label className="text-sm font-medium text-on-surface-variant-light dark:text-on-surface-variant-dark">
          {label}
        </label>
      )}
      <div
        onClick={handleClick} // <--- Usamos nuestra nueva función
        className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${
          on ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white dark:bg-surface-light shadow transform transition-transform ${
            on ? "translate-x-5" : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

export const SearchBar = ({ placeholder = "Buscar..." }) => (
  <div className="px-4 pb-4">
    <div className="relative flex items-center">
      <span className="material-symbols-outlined absolute left-4 text-text-secondary-light dark:text-text-secondary-dark">
        search
      </span>
      <input
        className="w-full rounded-xl border-none bg-neutral-200/60 py-3 pl-12 pr-10 text-text-primary-light placeholder:text-text-secondary-light focus:ring-2 focus:ring-primary/50 dark:bg-card-dark dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark"
        placeholder={placeholder}
        type="text"
      />
      <span className="material-symbols-outlined absolute right-4 cursor-pointer text-text-secondary-light dark:text-text-secondary-dark">
        mic
      </span>
    </div>
  </div>
);
