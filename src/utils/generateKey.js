import { v4 as uuidv4 } from "uuid";

export const generateVideoKey = ({ userId, fileName }) => {
  const ext = fileName.split(".").pop();
  return `videos/${userId}/${uuidv4()}.${ext}`;
};