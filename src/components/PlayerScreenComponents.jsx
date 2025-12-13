import { NeumorphicButton } from "./UIBasicComponents";

export const PlayerControls = ({ onPlayPause, isPlaying }) => (
  <div className="flex items-center justify-between gap-6 px-8 py-4">
    <NeumorphicButton className="h-16 w-16">
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

    <NeumorphicButton className="h-16 w-16">
      <span className="material-symbols-outlined text-4xl">skip_next</span>
    </NeumorphicButton>
  </div>
);
export const PlaybackProgress = () => (
  <div className="flex flex-col gap-2 px-6 pt-4 pb-2">
    <div className="rounded-full bg-transparent p-1 shadow-neumorphic-inset-light dark:shadow-neumorphic-inset-dark">
      <div
        className="h-1.5 rounded-full bg-primary"
        style={{ width: "40%" }}
      ></div>
    </div>
    <div className="flex justify-between">
      <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-xs font-normal leading-normal">
        1:25
      </p>
      <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-xs font-normal leading-normal">
        3:32
      </p>
    </div>
  </div>
);

export const NowPlayingInfo = () => (
  <div className="flex-shrink-0 px-6 pt-0 pb-2">
    <div className="flex justify-between items-center">
      <div className="flex-1 min-w-0">
        <h1 className="text-on-surface-light dark:text-on-surface-dark tracking-tight text-2xl font-bold leading-tight truncate">
          Luces de Neón
        </h1>
        <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-base font-normal leading-normal truncate pt-1">
          Valeria Synth
        </p>
      </div>
      <NeumorphicButton className="h-12 w-12 ml-4 flex-shrink-0 hover:text-primary">
        <span className="material-symbols-outlined">favorite_border</span>
      </NeumorphicButton>
    </div>
  </div>
);

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
