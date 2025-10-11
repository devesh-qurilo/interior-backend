import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
import slugify from "slugify";

const r = Router();
r.use(requireAdmin);

// CREATE
r.post("/", async (req, res) => {
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
    imageUrl = [], // selected 3–6 from afterImageUrl
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

  try {
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
    });
    return res
      .status(201)
      .json({
        status: true,
        message: "Project created",
        data: { id: created.id, slug: created.slug },
      });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, message: "Failed to create project" });
  }
});

export default r;
