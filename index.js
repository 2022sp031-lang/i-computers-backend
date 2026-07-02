import express from 'express';
import mongoose from 'mongoose';
import studentRouter from './routers/studentRouter.js';
import userRouter from './routers/userRouter.js';
import authenticateUser from './middlewares/authontication.js';
import productRouter from './routers/productRouter.js';

const app = express();
const port = 3000;
const mongodbURI = "mongodb://admin:1234@ac-lmxtron-shard-00-00.6wtz3py.mongodb.net:27017,ac-lmxtron-shard-00-01.6wtz3py.mongodb.net:27017,ac-lmxtron-shard-00-02.6wtz3py.mongodb.net:27017/i-computers?ssl=true&replicaSet=atlas-dz88og-shard-0&authSource=admin&appName=Cluster0";

app.use(express.json())

app.use(authenticateUser)

app.use('/users', userRouter)
app.use('/products', productRouter)

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
