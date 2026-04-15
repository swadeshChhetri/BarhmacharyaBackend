import { FundingApplication, FundPool } from "./fund.model.js";

export const submitApplication = async (userId, data) => {
  const pool = await getFundPool();
  if (data.requestedAmount > pool.totalAmount) {
    throw new Error(`Requested amount exceeds the total available fund pool (₹ ${pool.totalAmount.toLocaleString()})`);
  }

  const application = new FundingApplication({
    user: userId,
    ...data,
  });
  return await application.save();
};

export const getAllApplications = async () => {
  return await FundingApplication.find().populate("user", "name email").sort({ appliedAt: -1 });
};

export const getUserApplications = async (userId) => {
  return await FundingApplication.find({ user: userId }).sort({ appliedAt: -1 });
};

export const updateApplicationStatus = async (appId, { status, approvedAmount, adminNote, canResubmit }) => {
  return await FundingApplication.findByIdAndUpdate(
    appId,
    { status, approvedAmount, adminNote, canResubmit },
    { new: true }
  );
};

export const getFundPool = async () => {
  let pool = await FundPool.findOne();
  if (!pool) {
    pool = await FundPool.create({ totalAmount: 500000 }); // Default 5L
  }
  return pool;
};

export const updateFundPool = async (userId, newAmount) => {
  let pool = await FundPool.findOne();
  if (pool) {
    pool.totalAmount = newAmount;
    pool.lastUpdatedBy = userId;
    return await pool.save();
  } else {
    return await FundPool.create({ totalAmount: newAmount, lastUpdatedBy: userId });
  }
};

export const getFundStats = async () => {
  const applications = await FundingApplication.find();
  const pool = await getFundPool();
  
  const allocated = applications.reduce((acc, a) => acc + (a.approvedAmount || 0), 0);
  
  const stats = {
    totalPool: pool.totalAmount,
    availableBalance: pool.totalAmount - allocated,
    totalApplications: applications.length,
    pending: applications.filter(a => a.status === 'SUBMITTED').length,
    allocated: allocated
  };
  
  return stats;
};
