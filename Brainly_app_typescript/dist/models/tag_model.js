"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = mongoose_1.default.Types.ObjectId;
const TagSchema = new Schema({
    names: { type: String, required: true, unique: true }
});
const TagModel = mongoose_1.default.model("Tag", TagSchema);
exports.default = TagModel;
