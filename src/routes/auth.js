const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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
    });
    const newUser = await user.save();
    res.status(200).send("User Created Successfully");
  } catch (err) {
    res.status(500).send("Error :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // Validate Values
    validateLoginData(req);
    // Checkign for Valid Credentials
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("Invalid Credentials");
    }
    // Checking For Correct Password
    else {
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        // Create a JWT
        const token = await user.getJWT();
        // Add the token to cookie
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
          domain: "",
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
        });

        res.status(200).send("Login Successful");
      } else {
        res.status(400).send("Incorrect Credentials");
      }
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = authRouter;
