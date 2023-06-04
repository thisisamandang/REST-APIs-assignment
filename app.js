const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", userRoutes);

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
