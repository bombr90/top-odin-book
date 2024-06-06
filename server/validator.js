const { body, validationResult } = require("express-validator");

const registerRules = () => {
  return [
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
  ];
}

const loginRules = () => {
  return [
    body("email", "Email required").trim().isEmail().escape(),
    body("password", "Password required").trim().notEmpty(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  registerRules,
  loginRules,
  validate,
};

//code snippet from: https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
