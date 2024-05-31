import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoute from './routes/auth.js';
import gambleRoute from './routes/gamble.js'
import userRoute from './routes/user.js';
import paymentRoute from './routes/payment.js';
import historyRoute from './routes/history.js';

const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/gamble', gambleRoute);
app.use('/api/user', userRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/history', historyRoute);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('connect');
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on('disconnect', () => {
    console.log('disconnect');
});

app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message|| 'Something went wrong!';
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack,
    });
});

app.listen(process.env.PORT, () => {
    connect();
    console.log(`server is running on port ${process.env.PORT}`);
})