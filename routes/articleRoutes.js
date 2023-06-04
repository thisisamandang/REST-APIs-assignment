const router = require("express").Router();
const {
  postArticle,
  getArticles,
} = require("../controllers/articleController");
const isAuth = require("../middleware/isAuth");

router.post("/users/:userId/articles", isAuth, postArticle);
router.get("/articles", isAuth, getArticles);
module.exports = router;
