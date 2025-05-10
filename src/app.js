const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

const PORT = 3000;

// API's

// middlware to parse data to json

app.use(express.json());

// Sign up API

app.post("/signup", async (req, res) => {
  const data=req.body;
  try {
    if (data?.firstName.length < 2) {
      throw new Error(
        "Invalid Update Request : Enter A Valid First Name"
      );
    }
    if (data?.lastName.length < 2) {
      throw new Error(
        "Invalid Update Request : Enter A Valid Last Name"
      );
    }
    // if (data?.skills.length > 20) {
    //   throw new Error(
    //     "Invalid Update Request : Skills More Than 20 Are Not Allowed"
    //   );
    // }
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(200).send("User Created Successfully");
  } catch (err) {
    res.status(500).send("Error Occured " + err.message);
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
      res.status(404).send("User Not Found");
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
      res.status(404).send("No user Found With This Email Id");
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
