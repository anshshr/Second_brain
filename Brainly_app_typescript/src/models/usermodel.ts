import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId


const UserSchema= new Schema({
    username : {
        type : String,
        required :true
    },
    password : {
        type : String,
        required :true
    },
})

const UserModel = mongoose.model("User" , UserSchema)

export default UserModel;