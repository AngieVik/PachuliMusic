import { Routes, Route, Navigate } from "react-router-dom";
import { AudioProvider } from "./context/AudioContext";
import "./App.css";
import SearchPage from "./pages/SearchPage";
import { LibraryPlaylistsPage } from "./pages/LibraryPlaylistsPage";
import { LibraryFavoritesPage } from "./pages/LibraryPlaylistsPage";
import { LibraryAlbumsPage } from "./pages/LibraryPlaylistsPage";
import NowPlayingPage from "./pages/NowPlayingPage";

import { useWakeLock } from "./hooks/useWakeLock";

const App = () => {
  useWakeLock();
  return (
    <AudioProvider>
      <Routes>
        {/* Redirección automática */}
        <Route path="/" element={<Navigate to="/player/cover" replace />} />

        {/* Rutas del Reproductor */}
        <Route
          path="/player/cover"
          element={<NowPlayingPage initialTab="cover" />}
        />
        <Route
          path="/player/equalizer"
          element={<NowPlayingPage initialTab="equalizer" />}
        />
        <Route
          path="/player/wave"
          element={<NowPlayingPage initialTab="wave" />}
        />
        <Route
          path="/player/list"
          element={<NowPlayingPage initialTab="list" />}
        />

        {/* Rutas de Biblioteca */}
        <Route path="/library" element={<LibraryPlaylistsPage />} />
        <Route path="/library/favorites" element={<LibraryFavoritesPage />} />
        <Route path="/library/albums" element={<LibraryAlbumsPage />} />

        {/* Búsqueda */}
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </AudioProvider>
  );
};

export default App;
