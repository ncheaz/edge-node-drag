const authService = require("../services/authService.js");

function authenticateToken(req, res, next) {
  authService
    .authenticateAndCache(req)
    .then((userData) => {
      if (userData) {
        next();
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    })
    .catch((error) => {
      console.error("Authentication error:", error);
      return res.status(401).json({ error: "Unauthorized" });
    });
}

module.exports = {
  authenticateToken
};
