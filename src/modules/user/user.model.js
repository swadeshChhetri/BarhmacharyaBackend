import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },

    phone: { type: String },

    password: { type: String, select: false },

    inviteTokenHash: { type: String, select: false },
    inviteExpiresAt: { type: Date },

    passwordResetTokenHash: {
      type: String,
      select: false,
      index: true,
    },

    passwordResetExpiresAt: {
      type: Date,
    },


    status: {
      type: String,
      enum: ["active", "pending", "blocked", "Normal", "TOP_MEMBERS"],
      default: "Normal",
    },

    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },

    profileImage: {
      type: String,
      default: null,
    },
    
    currentDay: {
      type: Number,
      default: 1,
    },

    completedDays: {
      type: [Number],
      default: [],
    },

    coins: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
