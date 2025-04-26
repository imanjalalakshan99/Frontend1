import { IOpeningHours } from "../models/OpeningHours";

interface BusinessDTO {
  name: string;
  type: string;
  description?: string;
  address?: string;
  location: {
    type: string;
    coordinates: number[];
  };
  phone: string;
  showOpeningHours: boolean;
  tags?: string[];
  openingHours: IOpeningHours[];
}

export default BusinessDTO;
