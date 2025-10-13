// api/src/routes/admin.projects.feature.js
import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
const r = Router();
r.use(requireAdmin);

r.patch("/:id/feature", async (req, res) => {
  const id = Number(req.params.id);
  const { isFeatured, featuredOrder } = req.body || {};
  try {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        isFeatured: !!isFeatured,
        featuredOrder: isFeatured ? featuredOrder ?? 0 : null,
      },
      select: { id: true, isFeatured: true, featuredOrder: true },
    });
    res.json({ status: true, message: "Feature flags updated", data: updated });
  } catch {
    res.status(404).json({ status: false, message: "Project not found" });
  }
});

export default r;
