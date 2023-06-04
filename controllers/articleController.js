const Article = require("../models/articleSchema");
const User = require("../models/userSchema");
module.exports.postArticle = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { title, description } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new article
    const article = new Article({
      title,
      description,
      author: user._id,
    });
    await article.save();

    res.status(201).json({
      statusCode: 201,
      data: {
        title: article.title,
        description: article.description,
      },
      message: "Article created successfully",
    });
  } catch (error) {
    console.error("Error in creating article:", error);
    res.status(500).json({ statusCode: 500, error: "Internal server error" });
  }
};

module.exports.getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find().populate("author", "name age");

    res.json({
      statusCode: 200,
      data: articles,
      message: "Fetched Articles Successfuly",
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, error: "Internal server error" });
  }
};
