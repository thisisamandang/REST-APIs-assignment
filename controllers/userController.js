const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Signup function
module.exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed.");
    error.StatusCode = 422;
    error.data = errors.array();
    res.json({
      statusCode: error.StatusCode,
      data: error.data,
      error: error.message,
    });
  }
  const { email, password, name, age } = req.body;

  //   password encryption using bcrypt
  bcrypt
    .hash(password, 10)
    .then((encryptedPass) => {
      const user = new User({
        email: email,
        password: encryptedPass,
        name: name,
        age: age,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        statusCode: 201,
        data: {
          userId: result._id,
          name: result.name,
          email: result.email,
          age: result.age,
        },
        message: "A new User entity created.",
      });
    })
    .catch((err) => {
      if (!err.StatusCode) {
        err.StatusCode = 500;
      }
      next(err);
    });
};

// Login Function
module.exports.login = (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  let currentUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("No user with the entered email was found.");
        error.StatusCode = 401;
        res.status(401).json({
          statusCode: error.StatusCode,
          data: error.data,
          error: error.message,
        });
      }
      currentUser = user;

      // Compare passwords using bcrypt
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Invalid Credentials");
        error.statusCode = 401;
        res.status(401).json({
          statusCode: error.StatusCode,
          data: error.data,
          error: error.message,
        });
      }
      // JWT Token generation
      const token = jwt.sign(
        { email: currentUser.email },
        // process.env.JWT_AUTH_KEY,
        "secretkey",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        statusCode: 200,
        data: {
          token: token,
          email: currentUser.email,
          userId: currentUser._id,
        },
        message: "Logged In",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Updating user profiles
module.exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, age } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, age },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ statusCode: 404, error: "User not found" });
    }

    res.json({
      statusCode: 200,
      data: {
        user,
      },
      message: "User profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, error: "Internal server error" });
  }
};
// hqg7eWZJRrbcmWuA
