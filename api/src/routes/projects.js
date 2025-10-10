import { Router } from "express";
import prisma from "../prisma.js";
const r = Router();

r.get("/", async (req, res) => {
  const { tag, featured } = req.query;
  const where = {};
  if (tag) where.tags = { has: tag };
  if (featured === "true") where.isFeatured = true;

  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json({ projects });
});

r.get("/:slug", async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
  });
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json(project);
});

export default r;
