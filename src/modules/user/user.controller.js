import { UserService } from "./user.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers(req.query);
    res.status(200).json({
      success: true,
      data: users.map(user => ({
        id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        joined: user.createdAt.toISOString().split('T')[0]
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getTopMembers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers({ status: "TOP_MEMBERS" });
    res.status(200).json({
      success: true,
      data: users.map(user => ({
        id: user._id,
        name: user.fullName,
        profileImage: user.profileImage,
        joined: user.createdAt.toISOString().split('T')[0]
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        joined: user.createdAt.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        joined: user.createdAt.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
