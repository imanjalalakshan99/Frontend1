import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { useEffect, useState } from "react";
import Map, { Marker, ViewStateChangeEvent } from "react-map-gl/maplibre";
import { placesActions } from "store/places-slice";
import IPlace from "types/IPlace";

import { PiMapPinFill } from "react-icons/pi";
import { MapLibreEvent } from "maplibre-gl";

const MainMap = () => {
  const dispatch = useAppDispatch();
  const places = useAppSelector((state) => state.places.places);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const focused = useAppSelector((state) => state.places.focused);
  const setFocused = (place: IPlace | null) => {
    dispatch(placesActions.setFocused(place));
  };
  const [viewState, setViewState] = useState({
    longitude: 19.941015236678783,
    latitude: 50.06301434728838,
    zoom: 13,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  const onMoveHandler = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };
  const onResize = (evt: MapLibreEvent) => {
    const mapWidth = evt.target._container.offsetWidth;
    const menuWidth =
      mapWidth >= 1280
        ? 1056
        : mapWidth >= 1024
        ? 800
        : mapWidth >= 475
        ? 400
        : 0;
    setViewState({
      ...viewState,
      padding: { top: 0, right: 0, bottom: 0, left: menuWidth },
    });
  };

  useEffect(() => {
    if (focused) {
      setViewState({
        ...viewState,
        longitude: focused.location.coordinates[0],
        latitude: focused.location.coordinates[1],
        zoom: 14,
      });
    }
  }, [focused]);

  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-hidden">
      <Map
        {...viewState}
        onMove={onMoveHandler}
        onResize={onResize}
        onLoad={onResize}
        mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=u0kFdoythHBvPdgFbgqj"
      >
        {places.map((place) => {
          return (
            <Marker
              key={place.id}
              longitude={place.location.coordinates[0]}
              latitude={place.location.coordinates[1]}
              anchor="bottom"
              onClick={() => setFocused(place)}
              className="relative"
            >
              <div className=" text-outline !font-semi absolute bottom-0 right-full top-1/2 -translate-y-1/2 cursor-pointer whitespace-nowrap text-xs font-semibold  text-black">
                {place.name}
              </div>
              <PiMapPinFill
                className={
                  "h-8 w-8 cursor-pointer drop-shadow-[0_0_4px_rgba(255,255,255,1)] hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.3)] " +
                  (place.createdBy.id !== userId
                    ? "text-blue-600"
                    : "text-red-600")
                }
              />
            </Marker>
          );
        })}
      </Map>
    </div>
  );
};

export default MainMap;
