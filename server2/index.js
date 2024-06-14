import express from "express"; 
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser"; 
import cors from "cors"; 
import morgan from "morgan"; 
import mysql from 'mysql2' // npm instal mysql2  
import path from 'path'; 
import { fileURLToPath } from 'url'; 
// __filename과 __dirname을 생성 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 
import authRoute from './routes/auth.js';
import gambleRoute from './routes/gamble.js'
import userRoute from './routes/user.js';
// import paymentRoute from './routes/payment.js';
import historyRoute from './routes/history.js';
const app = express(); 
dotenv.config();

//middlewares 
const corsOptions = { 
    origin: ['http://localhost:3000', 'http://localhost:3001'], // 클라이언트 url  
    credentials: true, // 자격 증명 허용 
} 
app.use(cors(corsOptions)) 
// morgan 로깅 미들웨어 사용 
app.use(morgan('combined')); 
app.use(cookieParser()) 
app.use(express.json()) 
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use((err, req, res, next) => { 
    const errorStatus = err.status || 500; 
    const errorMessage = err.message || "Something went wrong!"; 
    return res.status(errorStatus).json({ 
        success: false, 
        status: errorStatus, 
        message: errorMessage, 
        stack: err.stack, 
    }); 
}); 

// MySQL 연결 풀 설정 
const db = mysql.createPool({ 
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0 
}); 
// MySQL 연결 풀 연결 
db.getConnection((err, connection) => { 
    if (err) { 
        console.error('Error connecting to the database:', err.stack); 
        return; 
    } 
    console.log('Connected to the database.'); 
    connection.release(); // 연결 반환 
}); 

app.use('/api/auth', authRoute);
app.use('/api/gamble', gambleRoute);
app.use('/api/user', userRoute);
// app.use('/api/payment', paymentRoute);
app.use('/api/history', historyRoute);
app.listen(process.env.PORT, () => { 
    console.log(`Server is running on port ${process.env.PORT}`); 
}); 