import * as orderService from "./order.service.js";
import { ProductModel } from "../product/product.model.js";

export const handleCreateOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, discountAmount, finalAmount } = req.body;
    const userId = req.user?._id;

    // Validate request
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "No shipping address provided" });
    }

    // Prepare order data
    const orderData = {
      user: userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      discountAmount,
      finalAmount,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "COMPLETED", // Assuming online is already completed if we call this
      orderStatus: "PLACED",
    };

    const order = await orderService.createOrder(orderData);

    // TODO: Update stock levels if needed
    for (const item of items) {
       await ProductModel.findByIdAndUpdate(item.product, {
         $inc: { stock: -item.quantity }
       });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

export const handleGetUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const handleGetOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const handleGetAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

export const handleUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await orderService.updateOrder(id, updateData);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};
