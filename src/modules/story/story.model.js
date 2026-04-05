import mongoose from "mongoose";

const { Schema, model } = mongoose;

const StorySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["IMAGE", "VIDEO"],
      default: "IMAGE",
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const StoryModel = model("Story", StorySchema);
