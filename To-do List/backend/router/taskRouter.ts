import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabaseApiBaseUrl = `${SUPABASE_URL}/rest/v1/task`;
const router = express.Router();

interface Task {
  id?: string;
  text: string;
  subtask?: string | null;
  completed?: boolean;
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
  alert?: boolean;
  alert_time?: string | null;
}

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};


router.post("/", async (req, res) => {
  const { text, due_date, alert, alert_time, subtask } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    res.status(400).json({ error: "Task text is required." });
    return;
  }
  const task = {
    text: text.trim(),
    due_date: due_date ?? null,
    alert: alert ?? false,
    alert_time: alert_time ?? null,
    completed: false,
    created_at: new Date().toISOString(),
    subtask: subtask ?? null,
  };
  try {
    const { data } = await axios.post<Task[]>(supabaseApiBaseUrl, task, {
      headers: { ...headers, Prefer: "return=representation" },
    });
    res.status(201).json(data?.[0] ?? null);
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data?.message || error.message });
  }
});


router.get("/", async (_req, res) => {
  try {
    console.log("Fetching tasks from Supabase...");
    const { data } = await axios.get<Task[]>(
      `${supabaseApiBaseUrl}?select=*&order=created_at.desc`,
      { headers }
    );
    console.log("Tasks fetched successfully:", data);
    res.json(data || []);
  } catch (error: any) {
    console.error(
      "Error fetching tasks:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
      details: error.response?.data,
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { data } = await axios.get<Task[]>(
      `${supabaseApiBaseUrl}?select=*&id=eq.${req.params.id}`,
      { headers }
    );
    res.json(data?.[0] ?? null);
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data?.message || error.message });
  }
});


router.put("/:id", async (req, res) => {
  const updates = { ...req.body, updated_at: new Date().toISOString() };
  try {
    const { data } = await axios.patch<Task[]>(
      `${supabaseApiBaseUrl}?id=eq.${req.params.id}`,
      updates,
      {
        headers: { ...headers, Prefer: "return=representation" },
      }
    );
    res.json(data?.[0] ?? null);
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data?.message || error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { data } = await axios.delete<Task[]>(
      `${supabaseApiBaseUrl}?id=eq.${req.params.id}`,
      {
        headers: { ...headers, Prefer: "return=representation" },
      }
    );
    res.json({ message: "Task deleted", deletedTask: data?.[0] ?? null });
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data?.message || error.message });
  }
});

export default router;
