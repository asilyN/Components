import express from "express";
import { supabase } from "../supabaseclient"; 

const router = express.Router();

router.post("/", async (req, res) => {
    const { emoji } = req.body;
    if (!emoji) return res.status(400).json({ error: "Emoji is required" });
  
    const { error } = await supabase.from("emoji").insert([{ chosen_emoji: emoji }]);
  
    if (error) {
      console.error("❌ Error saving emoji:", error);
      return res.status(500).json({ error: "Error saving emoji" });
    }
    res.status(201).json({ message: "Emoji saved!" });
  });
  
  export default router;