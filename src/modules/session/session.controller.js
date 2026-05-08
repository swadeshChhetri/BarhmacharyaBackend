import * as sessionService from "./session.service.js";
import { info, error } from "../../config/logger.js";

export const createSession = async (req, res, next) => {
  try {
    const sessionData = {
      ...req.body,
      createdBy: req.user._id,
    };
    const session = await sessionService.createSession(sessionData);
    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (err) {
    error("Error creating session:", err);
    next(err);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }
    const sessions = await sessionService.getSessions(filters);
    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err) {
    error("Error fetching sessions:", err);
    next(err);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (err) {
    error("Error fetching session by ID:", err);
    next(err);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const session = await sessionService.updateSession(req.params.id, req.body);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: session,
    });
  } catch (err) {
    error("Error updating session:", err);
    next(err);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    const session = await sessionService.deleteSession(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (err) {
    error("Error deleting session:", err);
    next(err);
  }
};
