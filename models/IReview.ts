import { IUser } from "./IUser";

export type IReview = {
  _id: string;
  user: string | IUser;
  rating: number;
  comment?: string;
  image?: string;
};
