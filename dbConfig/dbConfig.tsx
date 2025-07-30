import { error } from "console";
import mongoose from "mongoose";

export async function connect()
{
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI is missing in environment variables!");
      throw new Error("MONGODB_URI is not set");
    }
    mongoose.connect(process.env.MONGODB_URI!);
    const connection=mongoose.connection;
    connection.on('connected',()=>{
      console.log("MongoDB connected successfully..");
    })

    connection.on('error',(err)=>{
      console.log("MongoDB connection error!", err);
      process.exit();
    })
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
    throw error;
  }
}