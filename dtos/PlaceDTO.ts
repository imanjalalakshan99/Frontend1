import { ILocation } from "../models/ILocation";
import { UserDTO } from "./UserDTO";

export type PlaceDTO = {
  id: string;
  name: string;
  description?: string;
  type: string;
  thumbnail: string;
  rating?: number;
  reviews: {
    id: string;
    user: string | UserDTO;
    rating: number;
    comment?: string;
  }[];
  menu: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
  }[];
  services: {
    id: string;
    name: string;
    description?: string;
    duration?: number;
    price: number;
    image?: string;
  }[];
  rooms: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    roomsCount: number;
    guestsCount: number;
    price: number;
  }[];
  location: ILocation;
  createdBy: UserDTO;
  address?: string;
  images?: string[];
  contactInfo: {
    phone: string;
    email?: string;
  };
  tags?: string[];
  openingHours: {
    dayOfWeek: number;
    from: string;
    to: string;
  }[];
  showOpeningHours: boolean;
};
