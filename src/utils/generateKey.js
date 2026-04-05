import { v4 as uuidv4 } from "uuid";

export const generateVideoKey = ({ userId, fileName }) => {
  const ext = fileName.split(".").pop();
  return `videos/${userId}/${uuidv4()}.${ext}`;
};

export const generateImageKey = ({ userId, fileName }) => {
  const ext = fileName.split(".").pop();
  return `images/${userId}/${uuidv4()}.${ext}`;
};

export const generateStoryKey = ({ userId, fileName }) => {
  const ext = fileName.split(".").pop();
  return `stories/${userId}/${uuidv4()}.${ext}`;
};