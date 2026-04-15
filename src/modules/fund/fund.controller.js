import * as fundService from "./fund.service.js";

export const submitApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const application = await fundService.submitApplication(userId, req.body);
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await fundService.getAllApplications();
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await fundService.getUserApplications(userId);
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const updated = await fundService.updateApplicationStatus(appId, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFundStats = async (req, res) => {
  try {
    const stats = await fundService.getFundStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFundPool = async (req, res) => {
  try {
    const userId = req.user._id;
    const { totalAmount } = req.body;
    const updatedPool = await fundService.updateFundPool(userId, totalAmount);
    res.json({ success: true, data: updatedPool });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
