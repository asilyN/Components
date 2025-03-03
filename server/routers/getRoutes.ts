import express from "express";
import { supabase } from "../supabaseclient";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("emoji")
    .select("chosen_emoji")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Supabase error (fetching emojis):", error);
    return res.status(500).json({ error: "Error fetching emojis" });
  }
  res.json(data);
});

export default router;
