import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
const r = Router();
r.use(requireAdmin);

/** PATCH /api/admin/enquiries/:id/status { status: "NEW"|"CONTACTED"|"CLOSED" } */
r.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!["NEW", "CONTACTED", "CLOSED"].includes(status || "")) {
    return res.status(400).json({ status: false, message: "Invalid status" });
  }
  try {
    const up = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });
    res.json({ status: true, message: "Status updated", data: up });
  } catch {
    res.status(404).json({ status: false, message: "Inquiry not found" });
  }
});

export default r;
