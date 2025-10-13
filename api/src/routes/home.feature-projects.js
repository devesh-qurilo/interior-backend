// api/src/routes/home.featured-projects.js
import { Router } from "express";
import prisma from "../prisma.js";
const r = Router();

r.get("/", async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 6, 1);
  const items = await prisma.project.findMany({
    where: { isFeatured: true },
    orderBy: [
      { featuredOrder: "asc" }, // order on homepage
      { createdAt: "desc" },
    ],
    take: limit,
    select: {
      slug: true,
      title: true,
      description: true,
      propertyType: true,
      area: true,
      layout: true,
      location: true,
      designHighlights: true,
      beforeImageUrl: true,
      afterImageUrl: true,
      imageUrl: true,
    },
  });
  res.json({
    status: true,
    message: "Featured projects fetched",
    data: { items },
  });
});

export default r;
