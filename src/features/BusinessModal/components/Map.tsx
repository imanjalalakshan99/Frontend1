import { PiMapPinFill } from "react-icons/pi";
import Map, { MapLayerMouseEvent, Marker } from "react-map-gl/maplibre";

interface Props {
  coordinates?: [number, number];
  setCoordinates: (coordinates: [number, number]) => void;
}

const SelectMap = ({ coordinates, setCoordinates }: Props) => {
  const handleMapClick = (event: MapLayerMouseEvent) => {
    setCoordinates([event.lngLat.lat, event.lngLat.lng]);
  };
  return (
    <div className="h-[250px] w-full">
      <Map
        onClick={handleMapClick}
        mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=u0kFdoythHBvPdgFbgqj"
        cursor="default"
      >
        {coordinates && (
          <Marker
            longitude={coordinates[1]}
            latitude={coordinates[0]}
            anchor="bottom"
          >
            <PiMapPinFill className="h-8 w-8 cursor-pointer text-red-600 drop-shadow-[0_0_4px_rgba(255,255,255,1)] hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]" />
          </Marker>
        )}
      </Map>
    </div>
  );
};

export default SelectMap;
