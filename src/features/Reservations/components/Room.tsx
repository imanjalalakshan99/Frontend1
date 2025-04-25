import { useAppDispatch } from "hooks/redux-hooks";
import { getMonthName } from "utils/dateTime";
import { Link } from "react-router-dom";
import Img from "components/Img";
import { showServiceEditingModal } from "store/service-actions";
import { DateTime } from "luxon";
import Button from "components/Button";
import { IRoomDTO } from "types/IReservation";
import { showRoomEditingModal } from "store/room-actions";

interface Props {
  id: string;
  placeId: string;
  date: string;
  room: IRoomDTO;
  name: string;
  image?: string;
  address?: string;
  selected: boolean;
  onClick: () => void;
  onCancel: () => void;
  bookAgain?: boolean;
  isOwner: boolean;
  reservationId: string;
}
const Room = ({
  id,
  placeId,
  date,
  name,
  image,
  address,
  room,
  onClick,
  onCancel,
  isOwner,
  bookAgain = false,
  reservationId,
}: Props) => {
  const dispatch = useAppDispatch();
  const startDate = DateTime.fromISO(date);
  const started = startDate < DateTime.now();
  const endDate = startDate.plus({ days: room.length });
  const isDone = endDate < DateTime.now();
  const onCancelClickHandler = () => onCancel();
  const openEditModal = () => {
    dispatch(
      showRoomEditingModal(
        id,
        placeId,
        room.id,
        reservationId,
        date,
        endDate.toJSDate().toISOString()
      )
    );
    console.log("open edit modal");
  };
  const order = isDone
    ? "3" + (100000000 - startDate.toMillis() / 60000)
    : (started ? "1" : "2") + startDate.toMillis() / 60000;
  const edit = isOwner || !started;
  return (
    <div
      className="box-border flex flex-col gap-2 rounded border p-4"
      onClick={onClick}
      style={{ order: order }}
    >
      {isDone && (
        <div className="inline-block w-fit rounded bg-gray-200 px-2 py-0.5 text-sm font-semibold ">
          Ended
        </div>
      )}
      {started && !isDone && (
        <div className="inline-block w-fit rounded bg-orange-500 px-2 py-0.5 text-sm font-semibold text-white">
          Now
        </div>
      )}

      <div className="text-xs font-medium text-gray-600">
        <span>
          {startDate.setLocale("en-GB").toLocaleString({
            weekday: "short",
            month: "long",
            day: "2-digit",
          })}
        </span>
        {" - "}
        <span>
          {endDate.setLocale("en-GB").toLocaleString({
            weekday: "short",
            month: "long",
            day: "2-digit",
          })}
        </span>
      </div>
      <h1 className="-my-1 text-lg font-semibold text-gray-800">{room.name}</h1>
      {room.description && (
        <div className="text-sm text-gray-600 ">{room.description}</div>
      )}
      <div className="text-sm">
        <span className="font-medium text-gray-600">Price: </span>
        <span className="font-semibold ">{room.price * room.length} zł</span>
      </div>
      {address && (
        <h6 className="text-sm font-semibold text-gray-400">{address}</h6>
      )}
      <Link
        className="flex flex-row items-center"
        to={`/place/${placeId}?details=overview`}
      >
        {image && (
          <Img
            src={"/" + image}
            alt={name}
            className="mr-2 h-5 w-5 rounded-full"
          />
        )}
        <h3 className="font-semibold text-gray-600">{name}</h3>
      </Link>
      <div className="flex gap-2">
        {edit && (
          <>
            <Button
              text="Cancel"
              onClick={onCancelClickHandler}
              className="bg-red-500 text-white"
            />
            <Button
              text="Edit"
              onClick={openEditModal}
              className="bg-gray-500 text-white"
            />
          </>
        )}
        {isDone && bookAgain && (
          <Link to={`/place/${placeId}?details=services`}>
            <Button text="Book again" className="bg-blue-500 text-white" />
          </Link>
        )}
        {isDone && (
          <Button
            text="Remove"
            onClick={onCancelClickHandler}
            className="bg-gray-500 text-white"
          />
        )}
      </div>
    </div>
  );
};

export default Room;
