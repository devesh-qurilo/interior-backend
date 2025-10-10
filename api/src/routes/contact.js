import { Router } from "express";
import prisma from "../prisma.js";
const r = Router();

r.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name || !email || !message)
    return res.status(400).json({ error: "name, email, message required" });

  const saved = await prisma.contactMessage.create({
    data: { name, email, phone, subject, message },
  });
  res.status(201).json({ ok: true, id: saved.id });
});

export default r;
