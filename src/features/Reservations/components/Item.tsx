import { IReservation } from "types/IReservation";
import Service from "./Service";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { reservationsActions } from "store/reservations-slice";
import { cancelReservation } from "store/reservations-actions";
import Room from "./Room";

interface Props {
  reservation: IReservation;
}

const Item = ({ reservation }: Props) => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const isClient = reservation.user?.id === userId;
  const isOwner = reservation.place.owner === userId;
  const selectedReservation = useAppSelector(
    (state) => state.reservations.selected
  );
  const dispatch = useAppDispatch();

  const setSelectedReservation = () => {
    dispatch(reservationsActions.setSelected(reservation.id));
  };
  const cancelReservationHandler = () => {
    const isDone = new Date(reservation.date).getTime() < Date.now();
    if (!isDone) {
      const confirm = window.confirm(
        `Are you sure you want to cancel this reservation?`
      );
      if (!confirm) return;
    }
    dispatch(cancelReservation(reservation.id));
  };

  if (reservation.service)
    return (
      <Service
        id={reservation.id}
        serviceId={reservation.service.id}
        placeId={reservation.place.id}
        title={reservation.service.name}
        description={reservation.service.description}
        address={reservation.place.address}
        name={reservation.place.name}
        selected={reservation.id === selectedReservation?.id}
        image={reservation.place.image}
        date={reservation.date}
        duration={reservation.service.duration || 0}
        onClick={setSelectedReservation}
        onCancel={cancelReservationHandler}
        bookAgain={isClient}
      />
    );

  if (reservation.room)
    return (
      <Room
        id={reservation.id}
        placeId={reservation.place.id}
        date={reservation.date}
        room={reservation.room}
        name={reservation.place.name}
        image={reservation.place.image}
        address={reservation.place.address}
        selected={reservation.id === selectedReservation?.id}
        onClick={setSelectedReservation}
        onCancel={cancelReservationHandler}
        bookAgain={isClient}
        isOwner={isOwner}
        reservationId={reservation.id}
      />
    );

  return null;
};

export default Item;
