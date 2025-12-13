import { useState } from "react";
import EqualizerView from "../components/EqualizerView";
import WaveformVisualizer from "../components/WaveformVisualizer";
import UpNextView from "../components/UpNextView";
import UniversalHeader from "./UniversalHeader";
import {
  PlayerScreenTabs,
  NowPlayingInfo,
  PlaybackProgress,
  PlayerControls,
} from "../components/PlayerScreenComponents";
import { useAudio } from "../hooks/useAudio";
import BottomNavBar from "./BottomNavBar";

const NowPlayingPage = ({
  initialTab = "cover",
  headerTitle = "Reproducción",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const { togglePlayback, isPlaying } = useAudio();

  const renderTabContent = () => {
    switch (activeTab) {
      case "cover":
        return (
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-xl flex-1"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0KeIJ3evKtZsmi8k3MeFEKVZmd2aUY6707SQI1YxrK9q0bBoh_0MLQ1lunCUN-Xj6BAhQ-z4c6bNrnwKO86ZNxQaisEnp5wZupSGSgzzMAqm3i4kGNIBSq_rXqqed-NBizXefxz3I8ccvk5onmDAcMmte0RgM1BB1iubyxX_KRU6JCLnhLmE7N_yatGGGH2H0zy6Uquw0sQrNFNRW5SQtHikwUxnWR7e4tSgX7z1spTbcSY9ittsjxOA5syC6iw9Nw03ZNsDFOf4")`,
            }}
          ></div>
        );
      case "equalizer":
        return <EqualizerView />;
      case "wave":
        return <WaveformVisualizer />;
      case "list":
        return <UpNextView />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      <UniversalHeader title={headerTitle} />
      <div className="flex w-full grow flex-col px-6 pt-4 pb-2">
        <div className="flex flex-col flex-1">
          <div className="w-full gap-1 overflow-hidden rounded-xl aspect-square flex shadow-neumorphic-light dark:shadow-neumorphic-dark">
            {renderTabContent()}
          </div>
          <PlayerScreenTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <NowPlayingInfo />
      <PlaybackProgress />

      <PlayerControls onPlayPause={togglePlayback} isPlaying={isPlaying} />

      <BottomNavBar active="home" />
    </div>
  );
};

export default NowPlayingPage;
