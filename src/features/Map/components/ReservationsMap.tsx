import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { useEffect, useState } from "react";
import Map, { Marker, ViewStateChangeEvent } from "react-map-gl/maplibre";
import { PiMapPinFill } from "react-icons/pi";
import { IReservation } from "types/IReservation";
import { reservationsActions } from "store/reservations-slice";
import { DateTime } from "luxon";

interface Res {
  id: string;
  name: string;
  coordinates: number[];
  status: string;
  isOwner: boolean;
}

export default function ReservationsMap() {
  const reservations = useAppSelector(
    (state) => state.reservations.reservations
  );
  const selected = useAppSelector((state) => state.reservations.selected);
  const filter = useAppSelector((state) => state.reservations.filter);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();
  const setFocused = (id: string) => {
    dispatch(reservationsActions.setSelected(id));
  };

  const [viewState, setViewState] = useState({
    longitude: 19.941015236678783,
    latitude: 50.06301434728838,
    zoom: 11,
  });

  const onMoveHandler = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  const res: Res[] = reservations.reduce((acc: Res[], curr) => {
    const business = acc.find((b) => b.id === curr.place.id);
    const startDate = DateTime.fromISO(curr.date);
    const started = startDate < DateTime.now();
    const endDate = curr.service
      ? startDate.plus({ minutes: curr.service.duration })
      : curr.room
      ? startDate.plus({ days: curr.room.length })
      : startDate;
    const isDone = endDate < DateTime.now();
    const status = isDone ? "done" : started ? "started" : "upcoming";
    const isOwner = filter === curr.place.id;
    if (!business) {
      if (!filter || isOwner) {
        acc.push({
          id: curr.place.id,
          name: curr.place.name,
          coordinates: curr.place.location.coordinates,
          status: status,
          isOwner: isOwner,
        });
      }
    } else {
      if (status === "started") business.status = status;
      if (status === "upcoming" && business.status !== "started")
        business.status = status;
    }
    return acc;
  }, []);

  useEffect(() => {
    if (selected) {
      setViewState({
        ...viewState,
        longitude: selected.place.location.coordinates[0],
        latitude: selected.place.location.coordinates[1],
        zoom: 14,
      });
    }
  }, [selected]);

  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-hidden">
      <Map
        {...viewState}
        onMove={onMoveHandler}
        mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=u0kFdoythHBvPdgFbgqj"
      >
        {res.map((r) => {
          return (
            <Marker
              key={r.id}
              longitude={r.coordinates[0]}
              latitude={r.coordinates[1]}
              anchor="bottom"
              onClick={() => setFocused(r.id)}
              className="relative"
            >
              <div className=" text-outline !font-semi absolute bottom-0 right-full top-1/2 -translate-y-1/2 cursor-pointer whitespace-nowrap text-xs font-semibold  text-black">
                {r.name}
              </div>
              <PiMapPinFill
                className={
                  "h-8 w-8 cursor-pointer  drop-shadow-[0_0_4px_rgba(255,255,255,1)] hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.3)] " +
                  (r.status === "started"
                    ? "animate-bounce text-orange-500"
                    : r.isOwner
                    ? "text-red-600"
                    : r.status === "upcoming"
                    ? "text-blue-600"
                    : "text-gray-600")
                }
              />
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
