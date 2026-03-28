const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export const validateVideoUpload = (req, res, next) => {
  console.log("Validating video upload with body:", req.body);
  const { fileName, fileType, fileSize } = req.body;

  if (!fileName || !fileType || !fileSize) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!allowedTypes.includes(fileType)) {
    return res.status(400).json({ message: "Invalid file type" });
  }

  if (fileSize > MAX_SIZE) {
    return res.status(400).json({ message: "File too large" });
  }

  next();
};