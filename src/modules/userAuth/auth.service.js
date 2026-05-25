import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "../user/user.model.js";
// import agentModel from "../agent/model/agent.model.js";
// import { signAccessToken } from "./auth.token.js";
import { signAccessToken } from "../../utils/jwt.js";
import { hashInviteToken } from "../../utils/inviteToken.js";
import { generatePasswordResetToken, hashPasswordResetToken } from "../../utils/passwordResetToken.js";
// import { sendPasswordResetEmail } from "../../core/email.service.js";

import { randomBytes } from "crypto";

const generateUniqueReferralCode = async (fullName) => {
  const prefix = fullName
    ? fullName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, "")
    : "BM";
  let isUnique = false;
  let code = "";
  let attempts = 0;
  while (!isUnique && attempts < 10) {
    const suffix = randomBytes(2).toString("hex").toUpperCase();
    code = `${prefix}${suffix}`;
    const exists = await userModel.findOne({ referralCode: code });
    if (!exists) {
      isUnique = true;
    }
    attempts++;
  }
  // Fallback if loop failed (should not happen)
  if (!isUnique) {
    code = `${prefix}${Date.now().toString().slice(-4)}`;
  }
  return code;
};

export const AuthService = {
  registerAgent: async ({ fullName, email, phone, password, referralCode }) => {
    if (!fullName || !email || !phone || !password) {
      const err = new Error("All fields are required");
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const err = new Error("Email already registered");
      err.statusCode = 400;
      throw err;
    }

    let referredById = null;
    if (referralCode && referralCode.trim() !== "") {
      const referrer = await userModel.findOne({
        referralCode: referralCode.trim().toUpperCase(),
      });
      if (!referrer) {
        const err = new Error("Invalid referral code");
        err.statusCode = 400;
        throw err;
      }
      referredById = referrer._id;

      // Reward the referrer with 50 coins
      referrer.coins = (referrer.coins || 0) + 50;
      await referrer.save();
    }

    const myReferralCode = await generateUniqueReferralCode(fullName);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      status: "Normal",
      referralCode: myReferralCode,
      referredBy: referredById,
    });

    // await agentModel.create({
    //   userId: user._id,
    //   phone,
    //   status: "ACTIVE",
    // });

    return {
      success: true,
      message: "Registration successful. Please login to continue.",
    };
  },

  login: async ({ email, password }) => {
    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.statusCode = 400;
      throw err;
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      const err = new Error("user not found");
      err.statusCode = 404;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    if (!["active", "Normal", "TOP_MEMBERS"].includes(user.status)) {
      const err = new Error("User account is not active");
      err.statusCode = 403;
      throw err;
    }

    const token = signAccessToken({
      sub: user._id,
      role: user.role,
    });


    return {
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        currentDay: user.currentDay,
        completedDays: user.completedDays,
        coins: user.coins,
        walletBalance: user.walletBalance,
        referralCode: user.referralCode,
      },
    };
  },

  setAgentPassword: async ({ token, password }) => {
    if (!token || !password) {
      const err = new Error("Token and password required");
      err.statusCode = 400;
      throw err;
    }

    const tokenHash = hashInviteToken(token);

    const user = await userModel.findOne({
      inviteTokenHash: tokenHash,
      inviteExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      const err = new Error("Invalid or expired invite token");
      err.statusCode = 400;
      throw err;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.updateOne(
        { _id: user._id },
        {
          password: hashedPassword,
          status: "active",
          inviteTokenHash: null,
          inviteExpiresAt: null,
        },
        { session }
      );

      await agentModel.updateOne(
        { userId: user._id },
        { status: "ACTIVE" },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return { userId: user._id };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  forgotPassword: async ({ email }) => {
    if (!email) {
      const err = new Error("Email is required");
      err.statusCode = 400;
      throw err;
    }

    const user = await userModel.findOne({ email }).select("+fullName +email");

    // Prevent enumeration — always return success to caller.
    if (!user || !["active", "Normal", "TOP_MEMBERS"].includes(user.status)) {
      return; // controller returns generic success
    }

    const { rawToken, tokenHash } = generatePasswordResetToken();

    await userModel.updateOne(
      { _id: user._id },
      {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      }
    );

    // Send email asynchronously.
    // Failures here should be logged (and possibly retried); do not return details to API caller.
    // try {
    //   await sendPasswordResetEmail({
    //     to: user.email,
    //     token: rawToken,
    //     fullName: user.fullName,
    //   });
    // } catch (sendErr) {
    //   // Log the error for ops; don't throw (keeps API behavior consistent).
    //   console.error("sendPasswordResetEmail failed:", sendErr);
    // }

    return;
  },

  resetPassword: async ({ token, password }) => {
    if (!token || !password) {
      const err = new Error("Token and password are required");
      err.statusCode = 400;
      throw err;
    }

    const tokenHash = hashPasswordResetToken(token);

    const user = await userModel
      .findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { $gt: new Date() },
      })
      .select("+password");

    if (!user) {
      const err = new Error("Invalid or expired reset token");
      err.statusCode = 400;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      }
    );

    return { userId: user._id };
  },

  updateProfile: async (userId, updateData) => {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    return {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
      currentDay: user.currentDay,
      completedDays: user.completedDays,
      coins: user.coins,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
    };
  },
};
