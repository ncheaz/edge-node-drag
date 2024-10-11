import authService from "../services/authService.js";

export function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const authToken = token.split(" ")[1];

  authService
    .authenticateAndCache(authToken)
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
