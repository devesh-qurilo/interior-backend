import { Router } from "express";
import prisma from "../prisma.js";

const r = Router();

/**
 * GET /api/home/stats
 * Response: { stats: [{ key, label, value, suffix }] }
 */
r.get("/", async (_req, res) => {
  const stats = await prisma.homeStat.findMany({
    orderBy: { order: "asc" },
    select: { key: true, label: true, value: true, suffix: true },
  });
  res.json({ stats });
});

export default r;
