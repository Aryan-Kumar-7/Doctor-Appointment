import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mogodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import path from "path";


// app config
const app = express();

const _dirname = path.resolve();

const port = process.env.PORT || 4000
connectDB();
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*', (_, res)=>{
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
})

app.get('/',(req, res)=>{
    res.send('API WORKING')
})

app.listen(port, ()=> console.log("Server Started At:", port))