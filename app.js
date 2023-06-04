const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", articleRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTION"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Connecting to Database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected Sucessfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//   Starting the server
app.listen(process.env.PORT, () => {
  console.log(`SERVER started on Port ${process.env.PORT}`);
});
