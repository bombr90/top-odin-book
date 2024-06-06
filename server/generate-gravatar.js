// source: https://docs.gravatar.com/api/avatars/node/

const crypto = require("crypto");

const getGravatarUrl = (email, size = 80) => {
  const trimmedEmail = email.trim().toLowerCase();
  const hash = crypto.createHash("sha256").update(trimmedEmail).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

// Example usage
// const email = "your-email@example.com";
// const size = 200; // Optional size parameter
// const gravatarUrl = getGravatarUrl(email, size);

// console.log("Gravatar URL:", gravatarUrl);

module.exports = getGravatarUrl;