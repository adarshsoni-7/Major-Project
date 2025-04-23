const User = require("../models/user");

// Render signUp form route
module.exports.renderSignUpForm = (req, res) => {
  res.render("./users/signUp.ejs");
};

//  signUp form route
module.exports.signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    let newUser = new User({
      email: email,
      username: username,
    });

    let registerredUser = await User.register(newUser, password);
    req.login(registerredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");

      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signUp");
  }
};

// Render Login form route
module.exports.renderLoginForm = async (req, res) => {
  res.render("./users/login.ejs");
};

// Login Route
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectedUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectedUrl);
};

// Logout Route

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out!");
    res.redirect("/listings");
  });
};
