const express = require("express");
const profileRouter = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // Sending back profile data
    const userData = req.user;
    console.log(userData);
    if (userData) {
      return res.status(200).json({
        userData: {
          name: userData.firstName + " " + userData.lastName,
          photoUrl: userData.photoUrl,
        }
      });
    } else {
      throw new Error("Something Happened : Please Login Again");
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowed = validateProfileEditData(req);
    const user = req.user;
    const data = req.body;
    Object.keys(data).every((key) => (user[key] = data[key]));
    if (!isAllowed) {
      throw new Error("Invalid Data");
    } else {
      await user.save();
      res.status(200).json({ message: "User Updated Successfully!" });
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});



profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const isValidPassword =await loggedInUser.validatePassword(req.body.oldPassword);
    if (!isValidPassword) {
      throw new Error("Invalid Password");
    }
    const newPassword = req.body.newPassword;
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Weak Password");
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newPasswordHash;
    await loggedInUser.save();
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res
      .status(200)
      .json({ message: "Password Changed Successfully! Please Login Again" });
  } catch (err) {
    res.status(400).json({ message: "Error : " + err.message });
  }
});

module.exports = profileRouter;
