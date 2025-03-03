import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import getRoutes from "./routers/getRoutes";
import postRoutes from "./routers/postRoute";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/emojis", getRoutes);
app.use("/api/emojis", postRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
