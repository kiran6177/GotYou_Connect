import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const MONGOURL = process.env.MONGOURL
export const connection = ()=>{
  
    mongoose.connect(MONGOURL)
    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
      })
      
      mongoose.connection.on("error", (err) => {
        console.log("Error connecting to MongoDB");
      })
      
      mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from MongoDB");
      })
}