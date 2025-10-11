import { Router } from "express";
import prisma from "../prisma.js";

const r = Router();

/**
 * GET /api/project/videos?projectSlug=&limit=6
 * Returns active videos (optionally filtered by projectSlug), ordered for display.
 * Example response:
 * { status:true, message:"Videos fetched", data:{ items:[{title,videoUrl,thumbnailUrl}] } }
 */
r.get("/", async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 6, 1);
  const projectSlug = req.query.projectSlug || undefined;

  const items = await prisma.projectVideo.findMany({
    where: { isActive: true, ...(projectSlug ? { projectSlug } : {}) },
    orderBy: { order: "asc" },
    take: limit,
    select: {
      id: true,
      title: true,
      videoUrl: true,
      thumbnailUrl: true,
      projectSlug: true,
    },
  });

  return res.json({
    status: true,
    message: "Videos fetched successfully",
    data: { items },
  });
});

/** Optional: single video by id (for a modal) */
r.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.projectVideo.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      videoUrl: true,
      thumbnailUrl: true,
      projectSlug: true,
    },
  });
  if (!item)
    return res.status(404).json({ status: false, message: "Video not found" });
  return res.json({
    status: true,
    message: "Video fetched successfully",
    data: item,
  });
});

export default r;
