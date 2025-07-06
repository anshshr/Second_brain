import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const contentTypes = ["image", "audio", "video", 'article']

const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type:String}],
    userId: { type: ObjectId, ref: 'User', required: true },
});


const contentModel = mongoose.model("content", contentSchema);

export default contentModel
