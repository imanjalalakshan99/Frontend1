import mongoose, { Schema, Document } from "mongoose";
import { IPlace } from "../models/IPlace";

export type IPlaceSchema = Document & IPlace;

const PlaceSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: String,
  address: String,
  location: {
    type: { type: String, default: "Point", required: true },
    coordinates: { type: [Number], index: "2dsphere", required: true },
  },
  thumbnail: { type: String, required: true },
  images: [String],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  contactInfo: {
    phone: { type: String, required: true },
    email: String,
  },
  tags: [String],
  services: [
    {
      name: { type: String, required: true },
      description: String,
      duration: Number,
      price: { type: Number, required: true },
      image: String,
    },
  ],
  menu: [
    {
      name: { type: String, required: true },
      description: String,
      price: { type: Number, required: true },
      image: String,
    },
  ],
  reservations: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      type: { type: String, required: true },
      serviceReservation: {
        type: {
          service: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          reservationTime: {
            from: { type: Date, required: true },
            to: { type: Date, required: true },
          },
        },
      },
      roomReservation: {
        type: {
          room: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          date: { type: Date, required: true },
          length: { type: Number, required: true },
        },
      },
    },
  ],
  reviews: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, required: true },
      comment: String,
    },
  ],
  openingHours: [
    {
      dayOfWeek: { type: Number, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
  ],
  showOpeningHours: { type: Boolean, required: true },
  rooms: [
    {
      name: { type: String, required: true },
      description: String,
      image: String,
      roomsCount: { type: Number, required: true },
      guestsCount: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

PlaceSchema.index({
  name: "text",
  description: "text",
  address: "text",
  type: "text",
  tags: "text",
});

export default mongoose.model<IPlaceSchema>("Place", PlaceSchema);
