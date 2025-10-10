import { Router } from "express";
import prisma from "../prisma.js";
const r = Router();

// CREATE
r.post("/", async (req, res) => {
  const { title, body, publishedAt } = req.body || {};
  if (!title || !body)
    return res.status(400).json({ error: "title and body required" });
  const post = await prisma.post.create({
    data: {
      title,
      body,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    },
  });
  res.status(201).json(post);
});

// LIST
r.get("/", async (_req, res) => {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  res.json(posts);
});

// READ
r.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return res.status(404).json({ error: "not found" });
  res.json(post);
});

// UPDATE
r.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const post = await prisma.post.update({ where: { id }, data: req.body });
    res.json(post);
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

// DELETE
r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.post.delete({ where: { id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

export default r;
