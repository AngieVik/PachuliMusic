import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import UniversalHeader from "./Header";
import BottomNavBar from "./BottomNavBar";
import { SearchBar } from "../components/UIBasicComponents";
import { usePlayerStore } from "../store/usePlayerStore";
import { extractMetadata } from "../utils/metadata";
import { saveAudioFile } from "../utils/db";

const SearchPage = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { recentSearches, removeRecentSearch, clearRecentSearches, setQueue } =
    usePlayerStore();

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const songs = [];

    for (const file of files) {
      // Only process audio files
      if (!file.type.startsWith("audio/")) continue;

      const metadata = await extractMetadata(file);

      // Save file to IndexedDB
      await saveAudioFile(metadata.id, file);

      songs.push(metadata);
    }

    if (songs.length > 0) {
      // Set as new queue and start playing
      setQueue(songs);
      // Navigate to list view
      navigate("/player/list");
    }

    // Reset input
    event.target.value = "";
  };

  const handleLocalStorageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveSearch = (searchId) => {
    removeRecentSearch(searchId);
  };

  const handleClearAll = () => {
    clearRecentSearches();
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <UniversalHeader title="Búsqueda" />
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
          {[
            {
              icon: "folder",
              text: "Almacenamiento interno",
              onClick: handleLocalStorageClick,
            },
            { icon: "cloud", text: "Google Drive", onClick: null },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              disabled={!item.onClick}
              className="flex items-center gap-4 rounded-xl px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-2xl">
                {item.icon}
              </span>
              <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                {item.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-8 pb-4 flex-grow">
        <div className="flex items-baseline justify-between px-2">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Búsquedas recientes
          </h2>
          {recentSearches.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Borrar
            </button>
          )}
        </div>

        {recentSearches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark opacity-30">
              search
            </span>
            <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark text-center">
              No hay búsquedas recientes
            </p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {recentSearches.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900/50"
              >
                <img
                  alt={item.title}
                  className={`h-12 w-12 object-cover ${
                    item.rounded ? "rounded-full" : "rounded-lg"
                  }`}
                  src={item.img}
                />
                <div className="flex flex-1 flex-col truncate">
                  <p className="truncate font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {item.title}
                  </p>
                  <p className="truncate text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {item.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSearch(item.id)}
                  className="flex size-10 items-center justify-center rounded-full bg-card-light text-text-secondary-light shadow-sm dark:bg-card-dark dark:text-text-secondary-dark hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <BottomNavBar active="search" />
    </div>
  );
};

export default SearchPage;
