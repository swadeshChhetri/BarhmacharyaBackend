import { MembershipRequestModel } from "./membership.model.js";
import User from "../user/user.model.js";

export const submitRequest = async (req, res) => {
  try {
    const { utr, amount } = req.body;
    const userId = req.user._id;

    const existingRequest = await MembershipRequestModel.findOne({ utr });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: "UTR already submitted" });
    }

    const membershipRequest = new MembershipRequestModel({
      user: userId,
      utr,
      amount: amount || 499,
    });

    await membershipRequest.save();

    res.status(201).json({
      success: true,
      message: "Membership request submitted successfully",
      data: membershipRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await MembershipRequestModel.find().populate("user", "fullName email phone");
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminNote } = req.body;

    const request = await MembershipRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = status;
    if (adminNote) request.adminNote = adminNote;

    await request.save();

    if (status === "APPROVED") {
      await User.findByIdAndUpdate(request.user, { status: "TOP_MEMBERS" });
    }

    res.status(200).json({ success: true, message: `Request ${status} successfully`, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
