export const normalizeUploadPaths = (req, res, next) => {
  if (req.file) {
    req.file.path = req.file.path.replace(/\\/g, "/");
  }

  if (req.files) {
    Object.keys(req.files).forEach((field) => {
      req.files[field].forEach((file) => {
        file.path = file.path.replace(/\\/g, "/");
      });
    });
  }

  next();
};
