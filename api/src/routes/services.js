import { Router } from "express";
import prisma from "../prisma.js";
const r = Router();

r.get("/", async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json({ services });
});

r.get("/:slug", async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { slug: req.params.slug },
  });
  if (!service || !service.isActive)
    return res.status(404).json({ error: "Not found" });
  res.json(service);
});

export default r;
