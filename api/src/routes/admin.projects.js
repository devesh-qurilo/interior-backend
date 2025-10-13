// api/src/routes/admin.projects.js
import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";

const r = Router();
r.use(requireAdmin);

// LIST (returns fields your UI needs)
r.get("/", async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 50, 1);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        propertyType: true,
        area: true,
        layout: true,
        location: true,
        imageUrl: true,
        afterImageUrl: true,
        beforeImageUrl: true,
        isFeatured: true,
        featuredOrder: true,
      },
    }),
    prisma.project.count(),
  ]);

  res.json({
    status: true,
    message: "Projects fetched",
    data: { items, page, limit, total },
  });
});

export default r;
