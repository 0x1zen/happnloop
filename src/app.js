const express = require("express");
const connectDB = require("./config/database");
const app = express();

const PORT = 3000;

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
