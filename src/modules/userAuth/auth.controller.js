import { AuthService } from "./auth.service.js";

export const registerAgent = async (req, res, next) => {
  try {
    const result = await AuthService.registerAgent(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const setAgentPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const result = await AuthService.setAgentPassword({ token, password });

    res.status(200).json({
      success: true,
      message: "Password set successfully. Account activated.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await AuthService.forgotPassword({ email });

    // Always success (prevent enumeration)
    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    await AuthService.resetPassword({ token, password });

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (err) {
    next(err);
  }
};



export const checkAuth = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    token: req.token,
  });
};
