// ESM: your package.json should have { "type": "module" }
import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
import slugify from "slugify";

const r = Router();
r.use(requireAdmin);

// LIST (GET /api/admin/projects)
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
        createdAt: true,
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

// CREATE (POST /api/admin/projects)
r.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      area,
      layout,
      location,
      designHighlights = [],
      beforeImageUrl = [],
      afterImageUrl = [],
      imageUrl = [], // 3–6 selected featured images (from after)
    } = req.body || {};

    if (!title || !location) {
      return res
        .status(400)
        .json({ status: false, message: "title and location are required" });
    }
    if (
      !Array.isArray(designHighlights) ||
      !Array.isArray(beforeImageUrl) ||
      !Array.isArray(afterImageUrl)
    ) {
      return res
        .status(400)
        .json({ status: false, message: "images/highlights must be arrays" });
    }
    if (imageUrl.length < 3 || imageUrl.length > 6) {
      return res
        .status(400)
        .json({ status: false, message: "Select 3 to 6 featured images" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const created = await prisma.project.create({
      data: {
        slug,
        title,
        description: description || null,
        propertyType: propertyType || null,
        area: area || null,
        layout: layout || null,
        location,
        designHighlights,
        beforeImageUrl,
        afterImageUrl,
        imageUrl,
        isFeatured: false,
      },
      select: { id: true, slug: true },
    });

    return res
      .status(201)
      .json({ status: true, message: "Project created", data: created });
  } catch (e) {
    console.error("admin create project error:", e);
    return res
      .status(500)
      .json({ status: false, message: "Failed to create project" });
  }
});

export default r;
