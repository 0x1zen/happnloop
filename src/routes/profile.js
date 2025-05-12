const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // Sending back profile data
    const userData = req.user;
    if (userData) {
      res.status(200).send({
        firstName: userData.firstName,
        lastName: userData.lastName,
        about: userData.about,
      });
    } else {
      throw new Error("Something Happened : Please Login Again");
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = profileRouter;