import { Router, type IRouter } from "express";
import { z } from "zod";
import { usersDatabase } from "../lib/mlm.js";

const router: IRouter = Router();

const CreateUserSchema = z.object({
  name: z.string().min(1, "name is required"),
  phone: z.string().min(1, "phone is required"),
  referredBy: z.string().nullable().optional(),
});

router.get("/users", (_req, res) => {
  const leaderboard = Object.entries(usersDatabase)
    .map(([phone, user]) => ({
      phone,
      name: user.name,
      balance: user.balance,
      referredBy: user.referredBy,
    }))
    .sort((a, b) => b.balance - a.balance);

  res.json(leaderboard);
});

router.post("/users", (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, phone, referredBy } = parsed.data;

  // Validate referredBy exists if provided
  if (referredBy && !usersDatabase[referredBy]) {
    res.status(400).json({ error: `Referrer with phone ${referredBy} not found` });
    return;
  }

  const existing = usersDatabase[phone];

  if (existing) {
    // User exists — update name and referredBy if provided
    existing.name = name;
    if (referredBy !== undefined) {
      existing.referredBy = referredBy ?? null;
    }
    res.json({ success: true, created: false, user: { phone, ...existing } });
    return;
  }

  // New user
  usersDatabase[phone] = {
    name,
    balance: 0,
    referredBy: referredBy ?? null,
  };

  res.status(201).json({
    success: true,
    created: true,
    user: { phone, ...usersDatabase[phone] },
  });
});

router.get("/users/:phone", (req, res) => {
  const phone = req.params.phone;
  const user = usersDatabase[phone];

  if (!user) {
    res.status(404).json({ error: `No user found for phone ${phone}` });
    return;
  }

  const referralChain: { phone: string; name: string; relationship: string }[] = [];
  const relationships = ["parent (L1 — 5%)", "grandparent (L2 — 2%)", "great-grandparent (L3 — 1%)"];

  let currentPhone: string | null = user.referredBy;
  let depth = 0;

  while (currentPhone && usersDatabase[currentPhone] && depth < 3) {
    referralChain.push({
      phone: currentPhone,
      name: usersDatabase[currentPhone].name,
      relationship: relationships[depth]!,
    });
    currentPhone = usersDatabase[currentPhone].referredBy;
    depth++;
  }

  res.json({
    phone,
    name: user.name,
    balance: user.balance,
    referralChain,
  });
});

export default router;
