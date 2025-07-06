import mongoose, { connection } from "mongoose";

async function databaseConnections() {
    const connection = await mongoose.connect("mongodb+srv://anshshriofficial:MafbZcoXh3WuhtS8@railmadad.t2amj.mongodb.net/?retryWrites=true&w=majority&appName=railMadad")
    console.log("database connected successfully");

}


export default databaseConnections 