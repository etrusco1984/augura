import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // attach user info to the request
    
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message); 
    return res.status(401).json({ error: "Invalid token" });
  }
}

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
