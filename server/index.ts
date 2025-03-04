// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import getRoutes from "./routers/getRoutes";
// import postRoutes from "./routers/postRoute";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// app.use("/api/emojis", getRoutes);
// app.use("/api/emojis", postRoutes);

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

import express from 'express';
import cors from 'cors';


const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());


const employees = [
    { id: 1, name: 'John Doe',role:"developer", salary: 100000, },
    { id: 2, name: 'Jane Doe',role:"developer", salary: 120000 },
    { id: 3, name: 'John Smith', role:"developer",salary: 90000 },
];

app.get('/employees', (req, res) => {
    res.json(employees);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


