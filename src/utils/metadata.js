import { parseBlob } from 'music-metadata';


// Utility to extract metadata from audio files
export const extractMetadata = async (file) => {
  try {
    // 1. Intentar parsear metadatos reales con music-metadata
    const metadata = await parseBlob(file);
    const { common, format } = metadata;

    const title = common.title || file.name.replace(/\.[^/.]+$/, "");
    const artist = common.artist || "Artista Desconocido";
    const album = common.album || "Álbum Desconocido";
    const duration = format.duration || 0;

    // 2. Procesar Carátula (Artwork) usando Web APIs (Blob/URL)
    let artwork = null;
    if (common.picture && common.picture.length > 0) {
      const picture = common.picture[0];
      // Crear un Blob desde el Uint8Array
      const blob = new Blob([picture.data], { type: picture.format });
      // Crear una URL temporal de alto rendimiento
      artwork = URL.createObjectURL(blob);
    }

    return {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      artist,
      album,
      artwork, 
      isLocal: true,
      duration,
      file: file
    };

  } catch (error) {
    console.error("Error extracting metadata:", error);
    
    // Fallback básico si falla el parseo
    return {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
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
