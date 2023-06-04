const router = require("express").Router();
const User = require("../models/userSchema");
const { body } = require("express-validator");
const {
  signup,
  login,

  updateUser,
} = require("../controllers/userController");
const isAuth = require("../middleware/isAuth");

// Signup / Register route
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a Valid email.")
      .custom(async (value, { req }) => {
        return User.findOne({ email: value }).then((doc) => {
          if (doc) {
            return Promise.reject("email address already exists.");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 8 }),
    body("name").trim().not().isEmpty(),
    body("age").not().isEmpty(),
  ],
  signup
);

// Login route
router.post("/login", login);

// Updation Route
router.patch("/users/:userId", isAuth, updateUser);

module.exports = router;
