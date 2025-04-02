import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import router from './routers/router';
import path from 'path';

const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`);
console.log(`Loading environment variables from: ${envPath}`);

dotenv.config({ path: envPath });


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});