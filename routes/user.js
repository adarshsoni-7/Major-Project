const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/AsyncWrap.js");

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// SignUp form and post signup Route

router
  .route("/signUp")
  .get(userController.renderSignUpForm)
  .post(asyncWrap(userController.signUp));

// Login Form and Post Login Route

router
  .route("/login")
  .get(asyncWrap(userController.renderLoginForm))
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// Logout Route

router.get("/logout", userController.logout);
module.exports = router;
