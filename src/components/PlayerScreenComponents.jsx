import { NeumorphicButton } from "./UIBasicComponents";

export const PlayerControls = ({
  onPlayPause,
  onNext,
  onPrev,
  isPlaying,
  canGoNext,
  canGoPrev,
}) => (
  <div className="flex items-center justify-between gap-6 px-8 py-4">
    <NeumorphicButton
      className="h-16 w-16"
      onClick={onPrev}
      disabled={!canGoPrev}
    >
      <span className="material-symbols-outlined text-4xl">skip_previous</span>
    </NeumorphicButton>

    <button
      onClick={onPlayPause}
      className="flex items-center justify-center rounded-full h-20 w-20 bg-primary text-black shadow-lg shadow-primary/40"
    >
      <span className="material-symbols-outlined text-5xl filled">
        {isPlaying ? "pause" : "play_arrow"}
      </span>
    </button>

    <NeumorphicButton
      className="h-16 w-16"
      onClick={onNext}
      disabled={!canGoNext}
    >
      <span className="material-symbols-outlined text-4xl">skip_next</span>
    </NeumorphicButton>
  </div>
);
import { useAudio } from "../hooks/useAudio";
import { formatTime } from "../utils/metadata";

// ... PlayerControls ...

export const PlaybackProgress = () => {
  const { currentTime, duration, seek } = useAudio();

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-2 px-6 pt-4 pb-2">
      <div className="relative w-full h-4 group flex items-center">
        {/* Barra de Fondo */}
        <div className="absolute w-full h-1.5 rounded-full bg-surface-variant-light/30 dark:bg-surface-variant-dark/30 overflow-hidden">
          {/* Barra de Progreso */}
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Input Range Invisible para interacción */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime || 0}
          onChange={handleSeek}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Thumb visible solo en hover/active (opcional, por ahora solo barra) */}
      </div>

      <div className="flex justify-between select-none">
        <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-xs font-medium">
          {formatTime(currentTime)}
        </p>
        <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-xs font-medium">
          {formatTime(duration)}
        </p>
      </div>
    </div>
  );
};

export const NowPlayingInfo = ({
  currentTrack,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!currentTrack) {
    return (
      <div className="flex-shrink-0 px-6 pt-0 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h1 className="text-on-surface-light dark:text-on-surface-dark tracking-tight text-2xl font-bold leading-tight truncate opacity-50">
              Sin canción
            </h1>
            <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-base font-normal leading-normal truncate pt-1">
              Selecciona una canción para reproducir
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 px-6 pt-0 pb-2">
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h1 className="text-on-surface-light dark:text-on-surface-dark tracking-tight text-2xl font-bold leading-tight truncate">
            {currentTrack.title}
          </h1>
          <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-base font-normal leading-normal truncate pt-1">
            {currentTrack.artist}
          </p>
        </div>
        <NeumorphicButton
          className="h-12 w-12 ml-4 flex-shrink-0 hover:text-primary"
          onClick={onToggleFavorite}
        >
          <span
            className={`material-symbols-outlined ${
              isFavorite ? "filled text-primary" : ""
            }`}
          >
            favorite
          </span>
        </NeumorphicButton>
      </div>
    </div>
  );
};

export const TabButton = ({ icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center rounded-full h-12 w-12 transition-all ${
      isActive
        ? "text-primary shadow-neumorphic-inset-light dark:shadow-neumorphic-inset-dark"
        : "text-on-surface-variant-light dark:text-on-surface-variant-dark shadow-neumorphic-light dark:shadow-neumorphic-dark active:shadow-neumorphic-inset-light dark:active:shadow-neumorphic-inset-dark"
    }`}
  >
    <span className="material-symbols-outlined filled">{icon}</span>
  </button>
);

export const PlayerScreenTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex justify-center gap-4 py-6">
    <TabButton
      icon="album"
      isActive={activeTab === "cover"}
      onClick={() => setActiveTab("cover")}
    />
    <TabButton
      icon="equalizer"
      isActive={activeTab === "equalizer"}
      onClick={() => setActiveTab("equalizer")}
    />
    <TabButton
      icon="waves"
      isActive={activeTab === "wave"}
      onClick={() => setActiveTab("wave")}
    />
    <TabButton
      icon="list"
      isActive={activeTab === "list"}
      onClick={() => setActiveTab("list")}
    />
  </div>
);
