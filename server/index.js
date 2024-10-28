import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'

import authRoutes from './routes/authRoute.js'
import { requireSignin } from './middlewares/authMiddleware.js'


const app = express()
const port = process.env.PORT
const databaseURL = process.env.MONGODB_URL

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());

// routes middleware
app.use('/api/v1/auth', authRoutes)

// starting server
const server = app.listen(port, ()=>{
    console.log(`server started at PORT: http://localhost:${port}`);
})

// connecting mongodb
mongoose.connect(`${databaseURL}`)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});




