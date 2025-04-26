import { ILocation } from "../models/ILocation";
import { UserDTO } from "./UserDTO";

interface IRoomDTO {
  id: string;
  name: string;
  description?: string;
  image?: string;
  guestsCount: number;
  price: number;
  length: number;
}
interface IServiceDTO {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  duration?: number;
}
export interface ReservationDTO {
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
    location: ILocation;
  };
  user?: UserDTO;
}
