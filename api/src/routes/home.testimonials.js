import { Router } from "express";
import prisma from "../prisma.js";

const r = Router();

/**
 * GET /api/home/testimonials?limit=6
 * Returns active testimonials in display order.
 * Response shape includes status and message.
 */
r.get("/", async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 6, 1);

  const items = await prisma.homeTestimonial.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    take: limit,
    select: {
      userName: true,
      userLocation: true,
      userReview: true,
      userProfile: true,
      image: true,
    },
  });

  return res.json({
    status: true,
    message: "Testimonials fetched successfully",
    data: { items },
  });
});

export default r;
