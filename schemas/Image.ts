import mongoose, { Schema, Document } from "mongoose";
import { IImage } from "../models/IImage";

export type IImageSchema = Document & IImage;

const imageSchema = new Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.model<IImageSchema>("Image", imageSchema);
