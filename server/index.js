import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'
import { setupSocket } from './socket.js'

import authRoutes from './routes/authRoute.js'
import contactRoutes from './routes/contactRoutes.js'

import { requireSignin } from './middlewares/authMiddleware.js'
import messageRoutes from './routes/messageRoutes.js'
import channelRoutes from './routes/channelRoutes.js'



const app = express()
const port = process.env.PORT
const databaseURL = process.env.MONGODB_URL

app.use(cors({
    origin: ["process.env.ORIGIN","https://chat-app-frontend-o40f.onrender.com"],
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    credentials: true
}))

app.use("/uploads/files", express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

// routes middleware
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/channel', channelRoutes);

// starting server
const server = app.listen(port, ()=>{
    console.log(`server started at PORT: http://localhost:${port}`);
})

setupSocket(server)

// connecting mongodb
mongoose.connect(`${databaseURL}`)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});




