import { TbMap2, TbMapOff } from "react-icons/tb";

interface Props {
  isMapVisible: boolean;
  toggleMapVisibility: () => void;
  className?: string;
}

const MapButton = ({ isMapVisible, toggleMapVisibility, className }: Props) => {
  return (
    <div>
      <button
        onClick={toggleMapVisibility}
        className={
          "flex items-center p-2 text-gray-600 xs:hidden " +
          (className ? className : "")
        }
      >
        {isMapVisible ? (
          <TbMapOff className="h-7 w-7" />
        ) : (
          <TbMap2 className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};

export default MapButton;
