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
      enum: ["active", "pending", "blocked"],
      default: "pending",
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
