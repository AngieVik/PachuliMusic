import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NeumorphicButton } from "../components/UIBasicComponents";

const UniversalHeader = ({ title, onBackClick }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Estado para el Modo Oscuro
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  const handleBack = onBackClick ? onBackClick : () => navigate(-1);

  return (
    <div className="relative flex items-center p-4 pb-2 justify-between shrink-0 z-50">
      {/* BOTÓN ATRÁS */}
      <div className="flex w-12 items-center justify-start">
        <NeumorphicButton className="h-12 w-12" onClick={handleBack}>
          <span className="material-symbols-outlined">chevron_left</span>
        </NeumorphicButton>
      </div>

      {/* TÍTULO */}
      <h2 className="text-on-surface-light dark:text-on-surface-dark text-xl font-bold truncate text-center flex-1">
        {title}
      </h2>

      {/* MENÚ DE OPCIONES */}
      <div className="flex w-12 items-center justify-end relative">
        <NeumorphicButton
          className="h-12 w-12"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="material-symbols-outlined">more_vert</span>
        </NeumorphicButton>

        {menuOpen && (
          <React.Fragment>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            ></div>
            <div className="absolute top-14 right-0 w-60 bg-surface-light dark:bg-surface-dark rounded-lg shadow-neumorphic-light dark:shadow-neumorphic-dark p-4 z-20">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-on-surface-light dark:text-on-surface-dark text-sm">
                  Modo Oscuro
                </span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    darkMode
                      ? "bg-primary"
                      : "bg-on-surface-light/20 dark:bg-on-surface-dark/20"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default UniversalHeader;
