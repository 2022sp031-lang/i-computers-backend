import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
import authenticateUser from './middlewares/authontication.js';
import productRouter from './routers/productRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRouter from './routers/orderRouter.js';

dotenv.config()

const app = express();
const port = 3000;

const mongodbURI = process.env.MONGO_URI;

app.use(express.json())
app.use(cors())

app.use(authenticateUser)

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)

mongoose.connect(mongodbURI).then(
    ()=> {
        console.log("Connected to MongoDB");
    }
)
 
function go() {
    console.log("Started......."); 
}

app.listen(port, ()=> {
    console.log("Server started on port " + port + "........");
}); 


//testing phase 001
