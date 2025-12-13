import { Routes, Route } from "react-router-dom";
import { AudioProvider } from "./context/AudioContext";
import "./App.css";
import SearchPage from "./pages/SearchPage";
import { LibraryPlaylistsPage } from "./pages/LibraryPlaylistsPage";
import { LibraryFavoritesPage } from "./pages/LibraryPlaylistsPage";
import { LibraryAlbumsPage } from "./pages/LibraryPlaylistsPage";
import NowPlayingPage from "./pages/NowPlayingPage";

const App = () => {
  return (
    <AudioProvider>
      <Routes>
        {/* Redirección o página principal */}
        <Route path="/" element={<NowPlayingPage initialTab="cover" />} />

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
