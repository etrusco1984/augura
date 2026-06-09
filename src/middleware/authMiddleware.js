import jwt from "jsonwebtoken";

// ---------------------------------------
// AUTHENTICATE USER (Token-based)
// ---------------------------------------
export function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // attach decoded user info to request
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ---------------------------------------
// REQUIRE ROLE (Admin or others)
// ---------------------------------------
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (role === "admin" && !req.user.is_admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}
