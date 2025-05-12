const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

requestRouter.get("/request/send", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(`${user.firstName} sent a request`);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = requestRouter;
