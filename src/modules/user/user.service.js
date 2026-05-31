import User from "./user.model.js";
import bcrypt from "bcryptjs";

export class UserService {
  static async getAllUsers(query = {}) {
    const { search, role, status } = query;
    let filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) filter.role = role;
    if (status) filter.status = status;

    return await User.find(filter)
      .populate("referredBy", "fullName email phone")
      .sort({ createdAt: -1 });
  }

  static async getUserById(id) {
    return await User.findById(id);
  }

  static async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password || "DefaultPassword123!", 10);
    const user = new User({
      fullName: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: userData.status,
      password: hashedPassword, 
    });
    return await user.save();
  }

  static async updateUser(id, userData) {
    const update = {
      fullName: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: userData.status,
      coins: userData.coins !== undefined ? Number(userData.coins) : undefined,
      walletBalance: userData.walletBalance !== undefined ? Number(userData.walletBalance) : undefined,
    };
    
    // Remove undefined values
    Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);

    return await User.findByIdAndUpdate(id, update, { new: true });
  }

  static async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  static async updateCoins(id, amount) {
    return await User.findByIdAndUpdate(
      id,
      { $inc: { coins: amount } },
      { new: true }
    );
  }

  static async updateWalletBalance(id, amount) {
    return await User.findByIdAndUpdate(
      id,
      { $inc: { walletBalance: amount } },
      { new: true }
    );
  }

  static async getReferrals(userId) {
    return await User.find({ referredBy: userId })
      .select("fullName email profileImage currentDay createdAt status coins")
      .sort({ createdAt: -1 });
  }
}
