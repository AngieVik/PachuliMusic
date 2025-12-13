import { get, set, del } from 'idb-keyval';

// Guardar archivo de audio
export const saveAudioFile = async (id, file) => {
  try {
    await set(`audio_${id}`, file);
  } catch (err) {
    console.error("Error guardando audio:", err);
  }
};

// Recuperar archivo de audio
export const getAudioFile = async (id) => {
  return await get(`audio_${id}`);
};

// Borrar archivo
export const deleteAudioFile = async (id) => {
  await del(`audio_${id}`);
};