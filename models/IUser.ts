export type IUser = {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: string;
  profileImage?: string;
  phone: string;
  address?: string;
  dateOfBirth: Date;
};
