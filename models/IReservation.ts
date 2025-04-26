import { IRoom } from "./IRoom";
import { IService } from "./IService";
import { IUser } from "./IUser";

export type IServiceReservationTime = {
  from: Date;
  to: Date;
};

export type IServiceReservation = {
  service: string | IService;
  reservationTime: IServiceReservationTime;
};

export type IRoomReservation = {
  room: string | IRoom;
  date: Date;
  length: number;
};

export type IReservation = {
  _id: string;
  user: string | IUser;
  type: "service" | "room";
  serviceReservation?: IServiceReservation;
  roomReservation?: IRoomReservation;
};
