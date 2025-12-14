import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import UniversalHeader from "./Header";
import BottomNavBar from "./BottomNavBar";
import { SearchBar } from "../components/UIBasicComponents";
import { usePlayerStore } from "../store/usePlayerStore";
import { extractMetadata } from "../utils/metadata";

const SearchPage = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { listeningHistory, setQueue } = usePlayerStore();

  const handleFileSelect = async (event) => {
    try {
      const files = Array.from(event.target.files);

      if (files.length === 0) return;

      const songs = [];

      for (const file of files) {
        // Only process audio files
        if (!file.type.startsWith("audio/")) continue;

        // Extract metadata (ya incluye el archivo en metadata.file)
        const metadata = await extractMetadata(file);

        // RAM-based: El File object se mantiene en memoria en el objeto song
        // No guardamos en IndexedDB, solo mantenemos el File en RAM
        songs.push(metadata);
      }

      if (songs.length > 0) {
        console.log("✅ Queue updated with", songs.length, "tracks");
        console.log(
          "📋 First track:",
          songs[0].title,
          "Has file:",
          !!songs[0].file
        );

        // Set as new queue (los archivos quedan en RAM)
        setQueue(songs);
        // Navigate to list view
        navigate("/player/list");
      }
    } catch (error) {
      console.error("Error selecting files:", error);
      alert("Error al cargar los archivos. Por favor intenta de nuevo.");
    } finally {
      // Reset input
      if (event.target) event.target.value = "";
    }
  };

  const handleLocalStorageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background-light dark:bg-background-dark">
      <UniversalHeader title="Búsqueda" />

      {/* Main content with padding for fixed header/footer */}
      <main className="flex-1 pt-16 pb-20 overflow-y-auto w-full px-0">
        <SearchBar placeholder="Canciones, artistas o álbumes" />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col gap-4 px-4 pt-4">
          <h2 className="px-2 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Explorar
          </h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLocalStorageClick}
              className="flex items-center gap-4 rounded-xl px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 transition-colors"
            >
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-2xl">
                folder
              </span>
              <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                Almacenamiento interno
              </p>
            </button>
            <button
              disabled
              className="flex items-center gap-4 rounded-xl px-2 py-1 opacity-50 cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-2xl">
                cloud
              </span>
              <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                Google Drive
              </p>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 pt-8 pb-4 flex-grow">
          <div className="flex items-baseline justify-between px-2">
            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Últimas escuchadas
            </h2>
          </div>

          {listeningHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark opacity-30">
                history
              </span>
              <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark text-center">
                No hay canciones recientes
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {listeningHistory.map((item) => (
                <li
                  key={item.timestamp}
                  className="flex items-center gap-4 rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900/50"
                >
                  <img
                    alt={item.title}
                    className="h-12 w-12 object-cover rounded-lg"
                    src={item.artwork || "https://via.placeholder.com/48"}
                  />
                  <div className="flex flex-1 flex-col truncate">
                    <p className="truncate font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {item.title}
                    </p>
                    <p className="truncate text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {item.artist}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant-light dark:text-on-surface-variant-dark">
                    history
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <BottomNavBar active="search" />
    </div>
  );
};

export default SearchPage;
