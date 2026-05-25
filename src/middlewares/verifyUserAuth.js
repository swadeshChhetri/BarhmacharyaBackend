import { randomBytes } from "crypto";
// import agentModel from "../modules/agent/model/agent.model.js";
import userModel from "../modules/user/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

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
  if (!isUnique) {
    code = `${prefix}${Date.now().toString().slice(-4)}`;
  }
  return code;
};

export const verifyUserAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (!decoded.sub) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 🔑 Always use `sub`
    const userId = decoded.sub;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await userModel.findById(decoded.sub).select("-password");
    if (!user || !["active", "Normal", "TOP_MEMBERS"].includes(user.status)) {
      return res.status(401).json({ message: "user not found or inactive" });
    }

    // Self-heal: If existing user has no referralCode, generate one now
    if (!user.referralCode) {
      user.referralCode = await generateUniqueReferralCode(user.fullName);
      await user.save();
    }

    req.user = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      status: user.status,
      profileImage: user.profileImage,
      currentDay: user.currentDay,
      completedDays: user.completedDays,
      coins: user.coins,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,

      // 🔑 from JWT — DO NOT DROP
      client: decoded.client,
    };
    req.token = token;

    // // Attach agent profile only if needed
    // if (user.role === "agent") {
    //   const agent = await agentModel.findOne({ userId: user._id });
    //   if (!agent) {
    //   return res.status(403).json({ message: "Agent profile not linked" });
    //   }
    //   req.agent = agent;
    // }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
