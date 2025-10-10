import { Router } from "express";
import prisma from "../prisma.js";
const r = Router();

r.get("/", async (_req, res) => {
  const sections = await prisma.homeSection.findMany({
    orderBy: { order: "asc" },
  });
  res.json({ sections });
});

export default r;
