import fs from "fs/promises";

export const deleteFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
    console.log(`Fichier supprimé : ${filePath}`);
  } catch (err) {
    console.error(`Erreur suppression fichier ${filePath} :`, err.message);
  }
};