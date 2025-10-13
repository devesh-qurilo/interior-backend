// api/src/routes/admin.projects.feature.bulk.js
import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
const r = Router();
r.use(requireAdmin);

r.put("/featured-order", async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  // items: [{ id: 12, featuredOrder: 1 }, ...]
  await prisma.$transaction(
    items.map((it) =>
      prisma.project.update({
        where: { id: Number(it.id) },
        data: { isFeatured: true, featuredOrder: Number(it.featuredOrder) },
      })
    )
  );
  res.json({ status: true, message: "Featured order saved" });
});

export default r;
