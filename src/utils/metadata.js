// Utility to extract metadata from audio files
export const extractMetadata = async (file) => {
  try {
    // Create a basic metadata object from file
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    
    // Try to parse common naming patterns like "Artist - Title.mp3"
    let title = fileName;
    let artist = "Artista Desconocido";
    
    if (fileName.includes(" - ")) {
      const parts = fileName.split(" - ");
      artist = parts[0].trim();
      title = parts.slice(1).join(" - ").trim();
    }

    // Create a basic song object
    const metadata = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      artist,
      album: "Álbum Desconocido",
      artwork: null, // Could be extracted with jsmedia-tags library
      isLocal: true,
      duration: 0, // Will be set when audio loads
      file: file
    };

    return metadata;
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: file.name,
      artist: "Artista Desconocido",
      album: "Álbum Desconocido",
      artwork: null,
      isLocal: true,
      duration: 0,
      file: file
    };
  }
};

// Format time in MM:SS
export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
