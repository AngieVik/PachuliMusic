import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { deleteAudioFile } from '../utils/db';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      playlists: [], // { id, name: string, songs: [] }
      favorites: [], // Array de IDs de canciones
      recentSearches: [], // { id, title, subtitle, img, rounded, type, timestamp }
      queue: [], // Lista de reproducción actual
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

      // Favoritos
      toggleFavorite: (songId) => set((state) => {
        const isFav = state.favorites.includes(songId);
        return {
          favorites: isFav 
            ? state.favorites.filter(id => id !== songId)
            : [...state.favorites, songId]
        };
      }),

      // Crear Playlist
      createPlaylist: (name) => set((state) => ({
        playlists: [...state.playlists, { id: Date.now(), name, songs: [] }]
      })),

      // Agregar canción a Playlist
      addToPlaylist: (playlistId, song) => set((state) => ({
        playlists: state.playlists.map(pl => 
          pl.id === playlistId 
            ? { ...pl, songs: [...pl.songs, song] } 
            : pl
        )
      })),

      // Borrar canción (limpieza completa)
      removeFromQueue: async (index) => {
        const state = get();
        const songToRemove = state.queue[index];
        
        // Si es archivo local, borrar de IndexedDB para no ocupar espacio
        if (songToRemove.isLocal) {
            await deleteAudioFile(songToRemove.id);
        }

        const newQueue = [...state.queue];
        newQueue.splice(index, 1);
        
        // Ajustar índice si es necesario
        let newIndex = state.currentTrackIndex;
        if (index < newIndex) newIndex--;
        
        set({ queue: newQueue, currentTrackIndex: newIndex });
      },

      // Recent Searches
      addRecentSearch: (searchItem) => set((state) => {
        // Evitar duplicados recientes
        const filtered = state.recentSearches.filter(
          item => item.title !== searchItem.title || item.type !== searchItem.type
        );
        return {
          recentSearches: [
            { ...searchItem, id: Date.now(), timestamp: Date.now() },
            ...filtered
          ].slice(0, 20) // Limitar a 20 búsquedas recientes
        };
      }),

      removeRecentSearch: (searchId) => set((state) => ({
        recentSearches: state.recentSearches.filter(item => item.id !== searchId)
      })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      // Borrar Playlist
      deletePlaylist: (playlistId) => set((state) => ({
        playlists: state.playlists.filter(pl => pl.id !== playlistId)
      })),

      // Helper: Obtener canciones favoritas con detalles
      getFavoriteSongs: () => {
        const state = get();
        return state.queue.filter(song => state.favorites.includes(song.id));
      },

      // Helper: Obtener álbumes agrupados por artista
      getAlbumsByArtist: () => {
        const state = get();
        const albumsMap = new Map();
        
        // Recorrer todas las playlists y sus canciones
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
      name: 'music-player-storage', // Nombre para localStorage (persistencia de metadatos)
      partialize: (state) => ({ 
        playlists: state.playlists, 
        favorites: state.favorites,
        recentSearches: state.recentSearches,
        volume: state.volume 
      }),
    }
  )
);