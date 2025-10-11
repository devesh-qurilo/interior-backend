import { Router } from "express";
import prisma from "../prisma.js";

const r = Router();

r.get("/", async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 6, 1);

  const items = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
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

  return res.json({
    status: true,
    message: "Projects fetched successfully",
    data: { items },
  });
});

/**
 * GET /api/projects/:slug
 * Single project by slug (for a details modal/page if needed)
 */
r.get("/:slug", async (req, res) => {
  const item = await prisma.project.findUnique({
    where: { slug: req.params.slug },
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
      createdAt: true,
      updatedAt: true,
      imageUrl: true,
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
