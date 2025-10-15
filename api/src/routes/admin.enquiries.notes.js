import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
const r = Router();
r.use(requireAdmin);

/** POST /api/admin/enquiries/:id/notes { body, adminName? } */
r.post("/:id/notes", async (req, res) => {
  const id = Number(req.params.id);
  const { body, adminName } = req.body || {};
  if (!body || !body.trim()) {
    return res
      .status(400)
      .json({ status: false, message: "Note body is required" });
  }
  try {
    const note = await prisma.inquiryNote.create({
      data: { inquiryId: id, body, adminName: adminName || "Admin" },
      select: { id: true },
    });
    res.status(201).json({ status: true, message: "Note added", data: note });
  } catch {
    res.status(404).json({ status: false, message: "Inquiry not found" });
  }
});

/** GET /api/admin/enquiries/:id/notes */
r.get("/:id/notes", async (req, res) => {
  const id = Number(req.params.id);
  const notes = await prisma.inquiryNote.findMany({
    where: { inquiryId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, body: true, adminName: true, createdAt: true },
  });
  res.json({ status: true, message: "Notes fetched", data: { items: notes } });
});

export default r;
