const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const { userAuth } = require("../middlewares/auth");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
    await connectionRequest.save();
    res.status(200).json({
      "message" : "Connection Request Sent Successfully"
    })
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = requestRouter;
