import express from "express";
import dotenv from "dotenv";
const app = express();
import cookieParser from "cookie-parser";
import { databaseConnect } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

dotenv.config({ path : 'backend/config/config.env'});

// Handle Uncaught Error
process.on('uncaughtException', (err) => {
     console.log(`ERROR : ${err}`);
     console.log("Shutting down server due to the Uncaught Exception");
     process.exit(1);
})

// Connect database
databaseConnect();

app.use(express.json());
app.use(cookieParser())

// Import routes
import productRoutes  from "./routes/products.js"
import authRoutes from "./routes/auth.js"
import orderRoutes from "./routes/order.js"

app.use('/api/v1', productRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', orderRoutes);

// Use Error Middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT ,() => {
     console.log(`server is running on PORT : ${process.env.PORT} In ${process.env.NODE_ENV}`);
})

process.on('unhandledRejection', (err) => {
     console.log(`ERROR : ${err}`);
     console.log("Shutting down server due to Unhandeled promise rejection");
     server.close(() => {
          process.exit(1);
     })
})

process.on('SIGINT', () => {
     console.log('Received SIGINT. Shutting down gracefully...');
     // Perform cleanup
     server.close(() => {
         console.log('Closed out remaining connections.');
         process.exit(0);
     });
 });

 process.on('SIGTERM', () => {
     console.log('Received SIGTERM. Shutting down gracefully...');
     // Perform cleanup
     server.close(() => {
         console.log('Closed out remaining connections.');
         process.exit(0);
     });
 });
 

