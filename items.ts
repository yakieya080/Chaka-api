import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";

const router: IRouter = Router();

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CreateItemBodySchema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().optional(),
});

const UpdateItemBodySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

type Item = z.infer<typeof ItemSchema>;

const store = new Map<string, Item>();

router.get("/items", (_req, res) => {
  res.json(Array.from(store.values()));
});

router.post("/items", (req, res) => {
  const parsed = CreateItemBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const now = new Date().toISOString();
  const item: Item = {
    id: randomUUID(),
    name: parsed.data.name,
    description: parsed.data.description,
    createdAt: now,
    updatedAt: now,
  };
  store.set(item.id, item);
  res.status(201).json(item);
});

router.get("/items/:id", (req, res) => {
  const item = store.get(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json(item);
});

router.put("/items/:id", (req, res) => {
  const item = store.get(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  const parsed = UpdateItemBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updated: Item = {
    ...item,
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  store.set(item.id, updated);
  res.json(updated);
});

router.delete("/items/:id", (req, res) => {
  if (!store.has(req.params.id)) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  store.delete(req.params.id);
  res.status(204).send();
});

export default router;
