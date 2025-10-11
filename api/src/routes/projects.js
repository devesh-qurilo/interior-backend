import { Router } from "express";
import prisma from "../prisma.js";

const r = Router();

/**
 * GET /api/projects?limit=12&page=1&featured=&q=&propertyType=&location=
 * - Pagination: limit + page
 * - Filters: featured=true, propertyType, location
 * - Search: q in title/description
 */
r.get("/", async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 12, 1);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const where = {};
  if (req.query.featured === "true") where.isFeatured = true;
  if (req.query.propertyType) where.propertyType = req.query.propertyType;
  if (req.query.location)
    where.location = { contains: req.query.location, mode: "insensitive" };
  if (req.query.q) {
    const q = req.query.q;
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
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
        designHighlights: true,
        beforeImageUrl: true,
        afterImageUrl: true,
        imageUrl: true,
        isFeatured: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.project.count({ where }),
  ]);

  return res.json({
    status: true,
    message: "Projects fetched successfully",
    data: { items, page, limit, total },
  });
});

/** GET /api/projects/:slug */
r.get("/:slug", async (req, res) => {
  const item = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    select: {
      id: true,
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
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!item) {
    return res
      .status(404)
      .json({ status: false, message: "Project not found" });
  }
  return res.json({
    status: true,
    message: "Project fetched successfully",
    data: item,
  });
});

export default r;
