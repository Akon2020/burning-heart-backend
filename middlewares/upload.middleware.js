import multer from "multer";
import fs from "fs";
import path from "path";

const dossierMap = {
  avatar: "uploads/avatars",
  image: "uploads/images",
  autre: "uploads/autres",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dossier = dossierMap[file.fieldname] || "uploads/autres";
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    cb(null, dossier);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;