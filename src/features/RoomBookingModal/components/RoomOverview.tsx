import { useAppSelector } from "hooks/redux-hooks";
import { DateTime } from "luxon";

const RoomOverview = () => {
  const selected = useAppSelector((state) => state.places.focused);
  const selectedRoomId = useAppSelector((state) => state.room.roomId);
  const selectedRoom = selected?.rooms.find(
    (room) => room.id === selectedRoomId
  );
  const startDateString = useAppSelector(
    (state) => state.room.selectedStartDate
  );
  const endDateString = useAppSelector((state) => state.room.selectedEndDate);
  const priceForDay = selectedRoom ? selectedRoom.price : undefined;

  const startDate = startDateString
    ? DateTime.fromISO(startDateString)
    : undefined;
  const endDate = endDateString ? DateTime.fromISO(endDateString) : undefined;

  const duration =
    startDate && endDate ? endDate.diff(startDate, "days").days : undefined;

  const finalPrice =
    duration && priceForDay ? duration * priceForDay : undefined;

  if (!selectedRoom) return null;

  return (
    <div className="rounded-xl bg-gray-100 p-4">
      <h2 className="text font-semibold">{selectedRoom.name}</h2>
      {selectedRoom.description && (
        <div className="mt-1 text-sm text-gray-600 ">
          {selectedRoom.description}
        </div>
      )}
      {finalPrice && (
        <div className="mt-1 text-sm">
          <div className="text-gray-600">Price for {duration} nights</div>
          <div className="font-semibold ">{finalPrice} zł</div>
        </div>
      )}
    </div>
  );
};

export default RoomOverview;
