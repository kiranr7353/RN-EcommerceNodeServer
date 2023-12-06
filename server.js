import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import cloudinary from "cloudinary";
import Stripe from 'stripe'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
 
import testRoute from './routes/testRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import connectDB from './config/db.js';


dotenv.config();

connectDB();

export const stripe = new Stripe(process.env.STRIPE_API_SECRET);



cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use('/api/v1', testRoute)
app.use('/api/v1/user', userRoutes)
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cat", categoryRoutes);
app.use("/api/v1/order", orderRoutes);

app.get("/", (req, res) => {
    return res.status(200).send("<h1>Hello sdfdsfsdd sdsdfds</h1>")
})

const PORT = process.env.PORT || 8082;

app.listen(PORT), () => {
    console.log('Server running');
}