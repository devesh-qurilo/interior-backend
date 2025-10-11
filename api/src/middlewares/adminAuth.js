// api/src/middlewares/adminAuth.js
import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: false, message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.admin = { id: payload.id, email: payload.email };
    return next();
  } catch (e) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
}
