const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl";

// Get all the pending connection requests for the logged in user
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
      // }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);
    }).populate("fromUserId", "firstName lastName photoUrl");

    if (requests) {
      res.status(200).json({ data: requests });
    } else {
      res.status(400).json({ message: "No Requests Found" });
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    console.log(connections);
    const people = connections.map((connection) => {
      // console.log(connection);
      const isSender =
        connection.fromUserId._id.toString() === loggedInUser._id.toString();
      const otherUser = isSender ? connection.toUserId : connection.fromUserId;
      return {
        _id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
      };
    });
    res.status(200).json({ data: people });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = userRouter;
