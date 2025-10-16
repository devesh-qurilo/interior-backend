import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";

const r = Router();
r.use(requireAdmin);

// GET /api/admin/me
r.get("/", async (req, res) => {
  const me = await prisma.adminUser.findUnique({
    where: { id: req.admin.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
  return res.json({ status: true, message: "ok", data: me });
});

// PATCH /api/admin/me  { name?, email?, avatarUrl? }
r.patch("/", async (req, res) => {
  const { name, email, avatarUrl } = req.body || {};
  try {
    const updated = await prisma.adminUser.update({
      where: { id: req.admin.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      },
      select: { id: true, email: true, name: true, avatarUrl: true },
    });
    return res.json({
      status: true,
      message: "Profile updated",
      data: updated,
    });
  } catch (e) {
    // unique email conflict or other error
    const msg = e?.code === "P2002" ? "Email already in use" : "Update failed";
    return res.status(400).json({ status: false, message: msg });
  }
});

export default r;
