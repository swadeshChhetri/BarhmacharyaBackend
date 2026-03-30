import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

export const generateThumbnail = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const folder = path.dirname(outputPath);
    const filename = path.basename(outputPath);

    ffmpeg(inputPath)
      .screenshots({
        timestamps: ["1"], // 1 second
        filename: filename,
        folder: folder,
        size: "320x?",
      })
      .on("end", () => resolve(outputPath))
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      });
  });
};
