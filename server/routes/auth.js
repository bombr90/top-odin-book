const express = require("express");
// const createLocalUserData = require("../seed.js");
const User = require("../models/user.js");
const Auth = require("../models/auth.js")
const passport = require('passport');
const authController = require("./../controllers/authController.js");

const router = express.Router();
const {body, validationResult} = require("express-validator");
// *** Test route for automatically creating dummy users ***
// router.post("/user/local", async function (req, res) {
//   // Create new Odinbook user after checking if user exists
//   const newUser = new User(createLocalUserData());
//   const newAuthContent = {
//     _id: newUser._id,
//     email: newUser.email,
//     local: { email: newUser.email, password: "password" },
//   };
//   const newAuth = new Auth(newAuthContent);
//   const auth = await newAuth.save();
//   const user = await newUser.save();  
//   res.json({ message: `post'/user' path: ${req.baseUrl + req.path}`, user: user, auth: auth });
// });

router.post(
  "/user/local",
  body("email", "Valid email required")
    .trim()
    .toLowerCase()
    .isEmail()
    .escape()
    .notEmpty(),
  body("displayName", "Display name required").trim().notEmpty(),
  body("firstName").trim(),
  body("lastName").trim(),
  body("avatar").trim(),
  body("password", "Password required").trim().notEmpty(),
  async (req, res, next) => {
    const result = validationResult(req);
    console.log("result:", result);
    if (!result.isEmpty()) {
      console.log("router.post /user/local/: ", req.body);
      return res.status(400).json({ errors: result.array() });
    }
    next();
  },
  async function (req, res) {
    // Create new Odinbook user after checking if user exists
    const userExists = await User.exists({ email: req.body.email });
    if (userExists) {
      return res.json({
        message: `${req.body.email} already exists!`,
      });
    }
    const obj = {
      email: req.body.email,
      displayName: req.body.displayName,
      firstName: req.body.firstName || "",
      lastName: req.body.lastName || "",
      // avatar: req.body.avatar || "", //disabled for security reasons
      avatar: "",
    };
    const newUser = new User(obj);
    const newAuthContent = {
      _id: newUser._id,
      email: newUser.email,
      local: { email: newUser.email, password: req.body.password },
    };
    const newAuth = new Auth(newAuthContent);
    const auth = await newAuth.save();
    const user = await newUser.save();
    return res.json({
      path: `${req.originalUrl}`,
      data: {
        user: user,
        // auth: auth,
      },
    });
  }
);

router.get("/login", function (req, res) {
  // User privacy wall (login modal) or Timeline/feed
  console.log('session:',req.session)
  res.json({ message: `get'/' path: ${req.baseUrl + req.path}` });
});

router.post(
  "/login/local",
  body("email", "Email required").trim().isEmail().escape(),
  body("password", "Password required").trim().notEmpty(),
  async (req, res, next) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
      return res.status(400).json({errors: result.array()});
    }
    next();
  },
  passport.authenticate("local", { 
    // successRedirect: '/',
    // failureRedirect: "/" 
  }),
  function (req, res) {
    res.json({ message: "successful login", user: req.user, session: req.session, isAuthenticated: req.isAuthenticated() });
  }
);

router.post("/logout", function (req, res, next) {
  console.log('logging out')
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // res.cookie("connect.sid", null, {
    //   'Max-Age': -1,
    //   httpOnly: true,
    // });
    return res.json({
      message: "logout (auth)",
      user: res.user || "cleared",
      session: res.session || "cleared",
    });
    // req.session.destroy();
    // return res.clearCookie().json({
    //   message: "logout (auth)",
    //   user: res.user || "cleared",
    //   session: res.session || "cleared",
    // });
  });
});

// router.get("/test", authController.loggedIn, function (req, res) {
//   res.json({ message: "User currently logged in" });
// });

module.exports = router;
