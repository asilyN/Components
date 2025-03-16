import cors from 'cors';
import express from 'express';

import router from './routers/router';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.use('/api', router);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});