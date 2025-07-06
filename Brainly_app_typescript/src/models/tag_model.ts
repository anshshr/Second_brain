import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const TagSchema = new Schema({
    names: { type: String, required: true, unique: true }

})

const TagModel = mongoose.model("Tag", TagSchema);

export default TagModel