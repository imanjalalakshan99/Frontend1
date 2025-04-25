import { IUser } from "./IUser";

export interface IRoomDTO {
  id: string;
  name: string;
  description?: string;
  image?: string;
  guestsCount: number;
  price: number;
  length: number;
}
export interface IServiceDTO {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  duration?: number;
}
export interface IReservation {
  id: string;
  date: string;
  type: "service" | "room";
  service?: IServiceDTO;
  room?: IRoomDTO;
  place: {
    id: string;
    name: string;
    owner: string;
    address?: string;
    image?: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
  user?: IUser;
}
