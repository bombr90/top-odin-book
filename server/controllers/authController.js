const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("logged in as:\n", req.user);
    next();
  } else {
    res.redirect("/auth/v1/login");
    // return res.json({ message: "Unauthorized (not logged in)" });
  }
};

module.exports = { loggedIn };
