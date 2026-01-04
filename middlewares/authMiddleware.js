import jwt from "jsonwebtoken";

const authenticateClient = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Sets the user info if token is valid
    next(); // Proceed to the next step
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Optional authentication - doesn't block if no token
export const optionalAuthenticateClient = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    // No token provided, continue without user
    req.user = null;
    return next();
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Sets the user info if token is valid
    next();
  } catch (error) {
    // Invalid token, continue without user instead of blocking
    req.user = null;
    next();
  }
};

export default authenticateClient;
