import { SessionModel } from "./session.model.js";

const formatS3Url = (key) => {
  if (!key || key.startsWith("http")) return key;
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const createSession = async (sessionData) => {
  if (sessionData.thumbnail) {
    sessionData.thumbnail = formatS3Url(sessionData.thumbnail);
  }
  return await SessionModel.create(sessionData);
};

export const getSessions = async (filters = {}) => {
  const query = { deletedAt: null, ...filters };
  const sessions = await SessionModel.find(query)
    .sort({ startTime: -1 })
    .populate("createdBy", "fullName email");
  
  return sessions.map(session => {
    const s = session.toObject();
    s.thumbnail = formatS3Url(s.thumbnail);
    return s;
  });
};

export const getSessionById = async (id) => {
  const session = await SessionModel.findOne({ _id: id, deletedAt: null })
    .populate("createdBy", "fullName email");
  
  if (session) {
    const s = session.toObject();
    s.thumbnail = formatS3Url(s.thumbnail);
    return s;
  }
  return null;
};

export const updateSession = async (id, updateData) => {
  if (updateData.thumbnail) {
    updateData.thumbnail = formatS3Url(updateData.thumbnail);
  }
  
  const session = await SessionModel.findOneAndUpdate(
    { _id: id, deletedAt: null },
    updateData,
    { new: true }
  );

  if (session) {
    const s = session.toObject();
    s.thumbnail = formatS3Url(s.thumbnail);
    return s;
  }
  return null;
};

export const deleteSession = async (id) => {
  return await SessionModel.findOneAndUpdate(
    { _id: id },
    { deletedAt: new Date() },
    { new: true }
  );
};
