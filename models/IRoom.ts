export type IRoom = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  roomsCount: number;
  guestsCount: number;
  price: number;
};
