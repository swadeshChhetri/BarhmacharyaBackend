import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MembershipRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    utr: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      default: 499,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    adminNote: {
      type: String,
    },
  },
  { timestamps: true }
);

export const MembershipRequestModel = model("MembershipRequest", MembershipRequestSchema);
