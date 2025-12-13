import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UniversalHeader from "./Header";
import BottomNavBar from "./BottomNavBar";
import { SearchBar } from "../components/UIBasicComponents";
import { usePlayerStore } from "../store/usePlayerStore";

const LibraryTabs = ({ activeTab }) => {
  const tabs = [
    { id: "playlists", label: "Playlists", path: "/library" },
    { id: "favorites", label: "Favoritos", path: "/library/favorites" },
    { id: "albums", label: "Álbums", path: "/library/albums" },
  ];
  return (
    <div className="px-4 pb-4">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Link key={tab.id} to={tab.path}>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                activeTab === tab.id
                  ? "bg-primary text-black"
                  : "text-on-surface-variant-light dark:text-on-surface-variant-dark shadow-neumorphic-light dark:shadow-neumorphic-dark active:shadow-neumorphic-inset-light dark:active:shadow-neumorphic-inset-dark"
              }`}
            >
              {tab.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ListItem = ({ img, title, subtitle, icon, onHeartClick, isFavorite }) => (
  <div className="flex items-center gap-4">
    {img ? (
      <img
        className="w-16 h-16 rounded-lg object-cover shadow-neumorphic-light dark:shadow-neumorphic-dark"
        src={img}
        alt={title}
      />
    ) : (
      <div className="w-16 h-16 rounded-lg bg-surface-light dark:bg-surface-dark shadow-neumorphic-light dark:shadow-neumorphic-dark flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary">
          {icon}
        </span>
      </div>
    )}
    <div className="flex-1">
      <p className="text-on-surface-light dark:text-on-surface-dark font-semibold">
        {title}
      </p>
      <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-sm">
        {subtitle}
      </p>
    </div>
    {onHeartClick ? (
      <button
        onClick={onHeartClick}
        className="text-on-surface-variant-light dark:text-on-surface-variant-dark hover:text-primary transition-colors"
      >
        <span
          className={`material-symbols-outlined ${
            isFavorite ? "filled text-primary" : ""
          }`}
        >
          favorite
        </span>
      </button>
    ) : (
      <button className="text-on-surface-variant-light dark:text-on-surface-variant-dark">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    )}
  </div>
);

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playlistName.trim()) {
      onCreate(playlistName.trim());
      setPlaylistName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background-light dark:bg-background-dark rounded-2xl p-6 w-11/12 max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-on-surface-light dark:text-on-surface-dark mb-4">
          Crear nueva playlist
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Nombre de la playlist"
            className="w-full px-4 py-3 rounded-lg bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark border-2 border-transparent focus:border-primary outline-none transition-colors"
            autoFocus
          />
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg bg-surface-light dark:bg-surface-dark text-on-surface-variant-light dark:text-on-surface-variant-dark font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const LibraryPlaylistsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { playlists, createPlaylist, setQueue } = usePlayerStore();
  const navigate = useNavigate();

  const handleCreatePlaylist = (name) => {
    createPlaylist(name);
    setIsModalOpen(false);
  };

  const handlePlaylistClick = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      setQueue(playlist.songs);
      navigate("/player/list");
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <UniversalHeader title="Mi Biblioteca" />
      <SearchBar placeholder="Buscar en playlists..." />
      <LibraryTabs activeTab="playlists" />

      <div className="flex-grow px-4 overflow-y-auto pb-20">
        <div className="space-y-4">
          <div
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-4 p-2 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-neumorphic-sm-light dark:shadow-neumorphic-sm-dark">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <span className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Crear nueva playlist
            </span>
          </div>

          {playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark opacity-30">
                queue_music
              </span>
              <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark text-center">
                No tienes playlists creadas
              </p>
            </div>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist)}
              >
                <ListItem
                  title={playlist.name}
                  subtitle={`${playlist.songs.length} canciones`}
                  icon="queue_music"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />

      <BottomNavBar active="library" />
    </div>
  );
};

export const LibraryFavoritesPage = () => {
  const { favorites, toggleFavorite, getFavoriteSongs } = usePlayerStore();
  const favoriteSongs = getFavoriteSongs();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <UniversalHeader title="Favoritos" />
      <SearchBar placeholder="Buscar en favoritos..." />
      <LibraryTabs activeTab="favorites" />

      <div className="flex-grow px-4 overflow-y-auto pb-20">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-neumorphic-light dark:shadow-neumorphic-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-white filled">
                favorite
              </span>
            </div>
            <div className="flex-1">
              <p className="text-on-surface-light dark:text-on-surface-dark font-semibold">
                Canciones que te gustan
              </p>
              <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-sm">
                {favorites.length} canciones
              </p>
            </div>
          </div>

          {favoriteSongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark opacity-30">
                favorite
              </span>
              <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark text-center">
                No tienes canciones favoritas aún
              </p>
            </div>
          ) : (
            favoriteSongs.map((song) => (
              <ListItem
                key={song.id}
                img={song.artwork}
                title={song.title}
                subtitle={`${song.artist} • ${song.album}`}
                onHeartClick={() => toggleFavorite(song.id)}
                isFavorite={true}
              />
            ))
          )}
        </div>
      </div>
      <BottomNavBar active="library" />
    </div>
  );
};

export const LibraryAlbumsPage = () => {
  const { getAlbumsByArtist } = usePlayerStore();
  const albums = getAlbumsByArtist();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <UniversalHeader title="Álbums" />
      <SearchBar placeholder="Buscar álbums..." />
      <LibraryTabs activeTab="albums" />

      <div className="flex-grow px-4 overflow-y-auto pb-20">
        <div className="space-y-4">
          {albums.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark opacity-30">
                album
              </span>
              <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark text-center">
                No hay álbums en tus playlists
              </p>
            </div>
          ) : (
            albums.map((album, i) => (
              <ListItem
                key={i}
                img={album.img}
                title={album.title}
                subtitle={`${album.artist} • ${album.songs.length} canciones`}
              />
            ))
          )}
        </div>
      </div>
      <BottomNavBar active="library" />
    </div>
  );
};
