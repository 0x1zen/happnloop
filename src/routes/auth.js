const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");

const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation

    validateSignUpData(req);

    // Check for existing user
    const isFound = await User.findOne({ emailId: req.body.emailId });
    if (isFound) {
      throw new Error("Email Already Taken");
    }

    // Password Encryption

    const password = req.body.password;
    const passwordHash = await bcrypt.hash(password, 10);

    // Saving User Data To Database

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: passwordHash,
      dateOfBirth: req.body.dateOfBirth,
    });
    const newUser = await user.save();
    res.status(200).send("User Created Successfully");
  } catch (err) {
    res.status(500).send("Error :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password } = req.body;
    console.log(emailId, password);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(400).send("Invalid User");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly : true,
        secure:true,
        sameSite:"None",
        expires: new Date(Date.now() + 8 * 3600000),
        domain: "",
        path: "/",
      });
      res.status(200).json({
        status: "Login Successful",
        userData: {
          name: user.firstName + " " + user.lastName,
          photoUrl: user.photoUrl,
        },
      });
    } else {
      res.status(400).send("Incorrect Credentials");
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).send("Logged out successfully");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = authRouter;
