const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateVideoUpload = (req, res, next) => {
  console.log("Validating video upload with body:", req.body);
  const { fileName, fileType, fileSize } = req.body;

  if (!fileName || !fileType || !fileSize) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!allowedVideoTypes.includes(fileType)) {
    return res.status(400).json({ message: "Invalid file type" });
  }

  if (fileSize > MAX_VIDEO_SIZE) {
    return res.status(400).json({ message: "File too large" });
  }

  next();
};

export const validateImageUpload = (req, res, next) => {
  console.log("Validating image upload with body:", req.body);
  const { fileName, fileType, fileSize } = req.body;

  if (!fileName || !fileType || !fileSize) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!allowedImageTypes.includes(fileType)) {
    return res.status(400).json({ message: "Invalid file type" });
  }

  if (fileSize > MAX_IMAGE_SIZE) {
    return res.status(400).json({ message: "File too large" });
  }

  next();
};

export const validateStoryUpload = (req, res, next) => {
  console.log("Validating story upload with body:", req.body);
  const { fileName, fileType, fileSize } = req.body;

  if (!fileName || !fileType || !fileSize) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const allowedStoryTypes = [...allowedImageTypes, ...allowedVideoTypes];
  const MAX_STORY_SIZE = 50 * 1024 * 1024; // 50MB for video

  if (!allowedStoryTypes.includes(fileType)) {
    return res.status(400).json({ message: "Invalid file type. Stories support images and videos." });
  }

  if (fileSize > MAX_STORY_SIZE) {
    return res.status(400).json({ message: "File too large" });
  }

  next();
};