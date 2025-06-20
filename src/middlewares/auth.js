const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if(!token){
        return res.status(401).json({message : "Please Login"});
    }

    const decodedMessage = jwt.verify(token, "DEV@Happnloop$2");

    const { _id } = decodedMessage;
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("Invalid User");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    return res.status(400).json({message : err.message});
  }
};

module.exports = {
  userAuth,
};
