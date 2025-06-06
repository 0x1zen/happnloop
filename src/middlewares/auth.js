const jwt = require("jsonwebtoken");
const User = require("../models/user");
// middleware.js
const userAuth = async (req, res, next) => {
  try {
    // REad the token from req cookies
    const cookie = req.cookies;
    const { token } = cookie;
    if(!token){
        throw new Error("Please Login");
    }
    // Validate the token
    const decodedMessage = jwt.verify(token, "DEV@Happnloop$2");
    // Find does that the user exist in db
    const { _id } = decodedMessage;
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("Invalid User");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = {
  userAuth,
};
