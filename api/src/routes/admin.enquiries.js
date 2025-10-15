import { Router } from "express";
import prisma from "../prisma.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
const r = Router();
r.use(requireAdmin);

/**
 * GET /api/admin/enquiries
 * Query: q, status(NEW|CONTACTED|CLOSED), projectType, from(YYYY-MM-DD), to(YYYY-MM-DD), page, limit
 */
r.get("/", async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 9, 1);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const { q, status, projectType, from, to } = req.query;

  const where = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { message: { contains: q, mode: "insensitive" } },
      { contactNo: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } }, // if you have location in this model
    ];
  }
  if (status) where.status = status;
  if (projectType)
    where.projectType = { contains: projectType, mode: "insensitive" };
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from + "T00:00:00.000Z");
    if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z");
  }

  const [items, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        contactNo: true,
        projectType: true,
        propertyType: true,
        totalArea: true,
        message: true,
        createdAt: true,
        status: true,
      },
    }),
    prisma.contactInquiry.count({ where }),
  ]);

  res.json({
    status: true,
    message: "Enquiries fetched",
    data: { items, page, limit, total },
  });
});

export default r;
