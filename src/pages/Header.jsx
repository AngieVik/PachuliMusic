import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { NeumorphicButton } from "../components/UIBasicComponents";
import { usePlayerStore } from "../store/usePlayerStore";
import { extractMetadata } from "../utils/metadata";

const UniversalHeader = ({ title, onBackClick }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const addToQueue = usePlayerStore((state) => state.addToQueue);

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

  const handleAddFiles = async (event) => {
    const files = Array.from(event.target.files);

    for (const file of files) {
      if (!file.type.startsWith("audio/")) continue;

      const metadata = await extractMetadata(file);
      addToQueue(metadata);
    }

    // Reset input
    event.target.value = "";
    setMenuOpen(false);

    console.log(`✅ Added ${files.length} songs to queue`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-light dark:bg-background-dark">
      <div className="flex items-center p-4 pb-2 justify-between">
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={handleAddFiles}
        />

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
              <div className="absolute top-14 right-0 w-60 bg-surface-light dark:bg-surface-dark rounded-lg shadow-neumorphic-light dark:shadow-neumorphic-dark p-4 z-20 space-y-3">
                {/* Añadir canciones */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-primary">
                    add_circle
                  </span>
                  <span className="font-medium text-on-surface-light dark:text-on-surface-dark text-sm">
                    Añadir a la cola
                  </span>
                </button>

                {/* Modo Oscuro */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
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
    </header>
  );
};

export default UniversalHeader;
