const express = require("express");

const router = express.Router();

const latest = 'v1'

// router.get("/", function (req, res) {
//   res.json({
//     message:
//       "Welcome to the backend server. Prepend 'api/v1' to your url path in order to use the latest api version",
//   });
// });

router.get(["/"], function (req, res) {
  const newPath = `/api/${latest}${req.originalUrl}`;
  res.redirect(307, newPath);
});

// router.get(["/latest", "/latest*"], function (req, res) {
//   const newPath = `/api/${latest}${req.originalUrl.split("/latest")[1]}`;
//   res.redirect(307, newPath);
// });

module.exports = router;
