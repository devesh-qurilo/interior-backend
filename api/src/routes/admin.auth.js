// api/src/routes/admin.auth.js
import { Router } from "express";
import prisma from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const r = Router();

/** POST /api/admin/auth/login  { email, password } */
r.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res
      .status(400)
      .json({ status: false, message: "email and password required" });

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin)
    return res
      .status(401)
      .json({ status: false, message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, admin.password);
  if (!ok)
    return res
      .status(401)
      .json({ status: false, message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );
  return res.json({
    status: true,
    message: "Login successful",
    data: { token, name: admin.name },
  });
});

/** POST /api/admin/auth/forgot  { email }  (placeholder for now) */
r.post("/forgot", async (req, res) => {
  const { email } = req.body || {};
  if (!email)
    return res
      .status(400)
      .json({ status: false, message: "email is required" });

  // Optional: look up user quietly (don’t leak existence)
  // const user = await prisma.adminUser.findUnique({ where: { email } });
  // TODO: generate reset token, send email. For now just respond OK.
  return res.json({
    status: true,
    message: "If this email exists, a reset link has been sent.",
  });
});

export default r;
