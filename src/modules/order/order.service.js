import { OrderModel } from "./order.model.js";

export const createOrder = async (orderData) => {
  const order = new OrderModel(orderData);
  return await order.save();
};

export const getOrderById = async (orderId) => {
  return await OrderModel.findById(orderId).populate("user").populate("items.product");
};

export const getUserOrders = async (userId) => {
  return await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
};

export const getAllOrders = async () => {
  return await OrderModel.find().populate("user").sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId, status) => {
  return await OrderModel.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { new: true }
  );
};
