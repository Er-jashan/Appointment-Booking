import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// import { createServer } from 'http';
// import { Server } from 'socket.io';


//app configuration
const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.get('/', (req, res) => {
    res.send('API is working fine');
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));