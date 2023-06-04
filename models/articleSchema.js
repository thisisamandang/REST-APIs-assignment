const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
  },

  description: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("Articles", articleSchema);
