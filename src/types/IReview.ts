import { IUser } from "./IUser";

export interface IReview {
  user: IUser;
  rating: number;
  comment?: string;
}
