import mongoose from "mongoose";

const fundingApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    requestedAmount: {
      type: Number,
      required: true,
    },
    approvedAmount: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["SUBMITTED", "APPROVED", "REJECTED", "DISBURSED"],
      default: "SUBMITTED",
    },
    aadharNumber: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
    },
    bankAccountNumber: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    adminNote: {
      type: String,
    },
    canResubmit: {
      type: Boolean,
      default: false,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const fundPoolSchema = new mongoose.Schema(
  {
    totalAmount: {
      type: Number,
      default: 0,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const FundingApplication = mongoose.model("FundingApplication", fundingApplicationSchema);
export const FundPool = mongoose.model("FundPool", fundPoolSchema);
