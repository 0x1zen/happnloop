const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

const PORT = 3000;

app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
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
