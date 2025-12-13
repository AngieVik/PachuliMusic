import { usePlayerStore } from "../store/usePlayerStore";
import { useAudio } from "../hooks/useAudio";

const UpNextView = () => {
  const { queue, currentTrackIndex, playAtIndex } = usePlayerStore();
  const { togglePlayback } = useAudio();

  // Create a safe copy of queue to avoid mutation issues during render if any
  const upcomingSongs = queue || [];

  const handleSongClick = (index) => {
    // If clicking a different song, update index
    if (index !== currentTrackIndex) {
      playAtIndex(index);
    } else {
      togglePlayback();
    }
  };

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl flex-1 flex flex-col p-4 overflow-hidden h-full">
      <h3 className="text-lg font-bold mb-3 px-2 text-on-surface-light dark:text-on-surface-dark flex-shrink-0">
        A continuación
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {upcomingSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <span className="material-symbols-outlined text-4xl mb-2">
              queue_music
            </span>
            <p className="text-sm">Cola vacía</p>
          </div>
        ) : (
          upcomingSongs.map((song, index) => {
            const isCurrent = index === currentTrackIndex;
            return (
              <div
                key={`${song.id}-${index}`}
                onClick={() => handleSongClick(index)}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                  isCurrent
                    ? "bg-primary/20"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div
                  className="w-10 h-10 rounded bg-cover bg-center mr-3 flex-shrink-0"
                  style={{
                    backgroundImage: song.artwork
                      ? `url("${song.artwork}")`
                      : "none",
                    backgroundColor: "#e5e7eb",
                  }}
                >
                  {!song.artwork && (
                    <span className="material-symbols-outlined text-gray-500 w-full h-full flex items-center justify-center">
                      music_note
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm truncate ${
                      isCurrent
                        ? "text-primary"
                        : "text-on-surface-light dark:text-on-surface-dark"
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-xs text-on-surface-variant-light dark:text-on-surface-variant-dark truncate">
                    {song.artist}
                  </p>
                </div>
                {isCurrent && (
                  <span className="material-symbols-outlined text-primary text-lg ml-2">
                    equalizer
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpNextView;
