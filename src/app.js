const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const app = express();

const PORT = 3000;

// Validate functions

const { validateSignUpData } = require("./utils/validation");
const { validateLoginData } = require("./utils/validateLoginData");

// API's

// middlware to parse data to json

app.use(express.json());

// Sign up API

app.post("/signup", async (req, res) => {
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

// Login API

app.post("/login", async (req, res) => {
  try {
    // Validate Values
    validateLoginData(req);

    // Checkign for Valid Credentials
    const { emailId, password } = req.body;

    const isFound = await User.findOne({ emailId: emailId });
    if (!isFound) {
      res.status(404).send("Invalid Credentials");
    }
    // Checking For Correct Password
    else {
      const isPasswordValid = await bcrypt.compare(password, isFound.password);
      if (isPasswordValid) {
        res.status(200).send("User Login SuccessFul");
      } else {
        res.status(400).send("Incorrect Credentials");
      }
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

// Find By ID And Delete

app.get("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await User.findByIdAndDelete({ _id: userId });

    if (result) {
      res.status(200).send("User Deleted Successfully");
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (err) {
    console.error("Error Occured " + err.message);
  }
});

// Update User Info by user id
app.patch("/update/:userId", async (req, res) => {
  const userInfoUpdate = req.body;
  const userId = req.params.userId;
  try {
    const allowedUpdates = [
      "skills",
      "gender",
      "password",
      "photoUrl",
      "about",
    ];
    const isUpdateAllowed = Object.keys(userInfoUpdate).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid Update Request");
    }
    if (userInfoUpdate?.skills.length > 20) {
      throw new Error(
        "Invalid Update Request : Skills More Than 20 Are Not Allowed"
      );
    }
    const result = await User.findByIdAndUpdate(
      { _id: userId },
      userInfoUpdate,
      {
        new: true,
        runValidators: true,
      }
    );
    if (result) {
      console.log(result);
      res.status(200).send("User Data Updated Successfully");
    } else {
      res.status(404).send("Inavlid Request");
    }
  } catch (err) {
    res.status(400).send("Error Occured " + err.message);
  }
});

// Feed API - Get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (err) {
    res.status(400).send("Error Occured " + err.message);
  }
});

// Find A User By His Email Id - GET

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log(userEmail);
  try {
    const userData = await User.find({ emailId: userEmail });
    if (userData) {
      res.status(200).send(userData);
    } else {
      res.status(404).send("Invalid Credentials");
    }
  } catch (err) {
    console.error("Error Occured " + err.message);
  }
});

// Database connectivity and listener
connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Successfully listening on ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Error connecting the database");
  });
