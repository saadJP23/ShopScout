const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) return res.status(401).json({ msg: "No token provided" });

    // Optional: remove "Bearer " if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // 👈 Make sure this line exists
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token verification failed" });
  }
};

module.exports = auth;
