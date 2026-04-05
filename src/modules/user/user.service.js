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

    return await User.find(filter).sort({ createdAt: -1 });
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
    };
    return await User.findByIdAndUpdate(id, update, { new: true });
  }

  static async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}
