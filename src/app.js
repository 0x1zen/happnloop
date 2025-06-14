const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const PORT = 3000;

const corsOptions = {
  origin: "https://ce8e9120-69ff-4d9b-a271-e4c49117ca3f-00-25q6q6gszj3rn.pike.replit.dev",
  credentials: true,
};


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
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
