const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "Invalid Status",
        });
      }
      // Check if the to user Id does exist in database or not
      const toUser = await User.findById({ _id: toUserId });
      if (!toUser) {
        return res.status(400).json({ message: "Invalid User" });
      }
      // If there is already a connection request from the same user to the same user
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exists" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.status(200).json({
        message: `${req.user?.firstName} sent a request to ${toUser?.firstName}`,
      });
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      // Check If Valid Status
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status" });
      }
      // Check If Request exists in database
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(400).json({ message: "Invalid Request" });
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      res.status(200).json({ message: `Request ${status} successfully` });
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  },
);

module.exports = requestRouter;
