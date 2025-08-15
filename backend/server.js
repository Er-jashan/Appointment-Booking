import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import { connect } from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
// import { createServer } from 'http';
// import { Server } from 'socket.io';


//app configuration
const app = express();
const PORT = process.env.PORT || 3000;
connectDB().then(() => console.log('MongoDB connected successfully')).catch(err => console.error('MongoDB connection error:', err));
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.get('/', (req, res) => {
    res.send('API is working fine');
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));