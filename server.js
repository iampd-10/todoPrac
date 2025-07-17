import { dbConnection } from "./src/config/dbConnection.js";
import express from 'express';
import dotenv from 'dotenv'
import route from './src/routes/userRoute.js';
import { home } from "./src/Home/home.js";

dotenv.config();

const app = express();
 
dbConnection();

app.use(express.json());

app.use('/user', route);

app.get('/', home)

app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running at http://localhost:${process.env.PORT}`);
});