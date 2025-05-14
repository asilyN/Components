import dotenv from "dotenv";
dotenv.config();

import { supabase } from "./supabaseClient.js";
import express from "express";
import taskRouter from "./router/taskRouter.js";

const app = express();
const port = process.env.PORT || 5001;


app.get("/", (req, res) => {
  console.log(`Request received for path: ${req.path}`);
  res.send("Backend running 🎉 on port " + port);
});


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());


app.use("/task", taskRouter);


app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error handler middleware triggered:", err.stack);
    res.status(500).json({ error: "Something broke!" });
  }
);

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

console.log("Backend server ready. Supabase client initialized.");
