import IOpeningHours from "./IOpeningHours";

interface IBusiness {
  name: string;
  type: string;
  description?: string;
  address?: string;
  location: {
    type: string;
    coordinates: number[];
  };
  phone: string;
  tags?: string[];
  openingHours: IOpeningHours[];
  showOpeningHours: boolean;
}

export default IBusiness;
