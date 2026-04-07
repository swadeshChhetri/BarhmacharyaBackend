import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for guest checkout, but user usually logs in
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const OrderModel = model("Order", OrderSchema);
