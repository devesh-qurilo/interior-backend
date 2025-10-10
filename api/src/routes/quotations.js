import { Router } from "express";
import prisma from "../prisma.js";
const r = Router();

r.post("/", async (req, res) => {
  const { name, email, phone, serviceSlug, budgetMin, budgetMax, description } =
    req.body || {};
  if (!name || !email)
    return res.status(400).json({ error: "name and email required" });

  const saved = await prisma.quotationRequest.create({
    data: {
      name,
      email,
      phone,
      serviceSlug,
      budgetMin: budgetMin ? Number(budgetMin) : null,
      budgetMax: budgetMax ? Number(budgetMax) : null,
      description,
    },
  });
  res.status(201).json({ ok: true, id: saved.id });
});

export default r;
