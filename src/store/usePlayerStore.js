import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- SAFE STORAGE WRAPPER ---
// Intercepta errores si el navegador bloquea el almacenamiento (Cookies/LocalStorage)
const safeLocalStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      console.warn("LocalStorage access denied (Read). Running in volatile mode.");
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      console.warn("LocalStorage access denied (Write). Settings won't persist.");
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Ignoramos error
    }
  },
};

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      playlists: [],
      favorites: [],
      recentSearches: [],
      queue: [],
      currentTrackIndex: -1,
      isPlaying: false,
      volume: 1,
      
      // --- Acciones ---
      
      setQueue: (songs) => set({ queue: songs, currentTrackIndex: 0, isPlaying: true }),
      
      addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
      
      playNext: () => {
        const { queue, currentTrackIndex } = get();
        if (currentTrackIndex < queue.length - 1) {
          set({ currentTrackIndex: currentTrackIndex + 1 });
        }
      },
      
      playPrev: () => {
        const { currentTrackIndex } = get();
        if (currentTrackIndex > 0) {
          set({ currentTrackIndex: currentTrackIndex - 1 });
        }
      },

      playAtIndex: (index) => set({ currentTrackIndex: index, isPlaying: true }),

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setIsPlaying: (val) => set({ isPlaying: val }),

      toggleFavorite: (songId) => set((state) => {
        const isFav = state.favorites.includes(songId);
        return {
          favorites: isFav 
            ? state.favorites.filter(id => id !== songId)
            : [...state.favorites, songId]
        };
      }),

      createPlaylist: (name) => set((state) => ({
        playlists: [...state.playlists, { id: Date.now(), name, songs: [] }]
      })),

      addToPlaylist: (playlistId, song) => set((state) => ({
        playlists: state.playlists.map(pl => 
          pl.id === playlistId 
            ? { ...pl, songs: [...pl.songs, song] } 
            : pl
        )
      })),

      removeFromQueue: (index) => {
        const state = get();
        // Nota: Ya no borramos de disco, solo de la lista visual
        const newQueue = [...state.queue];
        newQueue.splice(index, 1);
        
        let newIndex = state.currentTrackIndex;
        if (index < newIndex) newIndex--;
        
        set({ queue: newQueue, currentTrackIndex: newIndex });
      },

      addRecentSearch: (searchItem) => set((state) => {
        const filtered = state.recentSearches.filter(
          item => item.title !== searchItem.title || item.type !== searchItem.type
        );
        return {
          recentSearches: [
            { ...searchItem, id: Date.now(), timestamp: Date.now() },
            ...filtered
          ].slice(0, 20)
        };
      }),

      removeRecentSearch: (searchId) => set((state) => ({
        recentSearches: state.recentSearches.filter(item => item.id !== searchId)
      })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      deletePlaylist: (playlistId) => set((state) => ({
        playlists: state.playlists.filter(pl => pl.id !== playlistId)
      })),

      getFavoriteSongs: () => {
        const state = get();
        return state.queue.filter(song => state.favorites.includes(song.id));
      },

      getAlbumsByArtist: () => {
        const state = get();
        const albumsMap = new Map();
        
        state.playlists.forEach(playlist => {
          playlist.songs.forEach(song => {
            const key = `${song.artist}-${song.album}`;
            if (!albumsMap.has(key)) {
              albumsMap.set(key, {
                title: song.album || 'Álbum Desconocido',
                artist: song.artist || 'Artista Desconocido',
                img: song.artwork,
                songs: []
              });
            }
            albumsMap.get(key).songs.push(song);
          });
        });

        return Array.from(albumsMap.values());
      }
    }),
    {
      name: 'music-player-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ 
        playlists: state.playlists, 
        favorites: state.favorites,
        recentSearches: state.recentSearches,
        volume: state.volume 
      }),
    }
  )
);