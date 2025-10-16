import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
import bcrypt from "bcryptjs";

const r = Router();
r.use(requireAdmin);

// POST /api/admin/me/change-password { currentPassword, newPassword }
r.post("/me/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({
        status: false,
        message: "Both current and new password are required",
      });
  }
  const user = await prisma.adminUser.findUnique({
    where: { id: req.admin.id },
  });
  if (!user)
    return res.status(404).json({ status: false, message: "Admin not found" });

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok)
    return res
      .status(400)
      .json({ status: false, message: "Current password is incorrect" });

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({
        status: false,
        message: "New password must be at least 8 characters",
      });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { password: hash },
  });
  return res.json({ status: true, message: "Password updated" });
});

export default r;
