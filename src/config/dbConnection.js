import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

export const dbConnection = ()=> {
    mongoose.connect(process.env.url)
   .then(() => {
    console.log(`Database is Connected at cluster0.9taqa3o.mongodb.net`);
    
   }).catch((err) => {
    console.log(`error is ${err}`);
   });
}
