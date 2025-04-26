import Img from "components/Img";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { useState } from "react";
import { showRoomBookingModal } from "store/room-actions";
import { fetchPlace } from "store/places-actions";
import NewRoomModal, { IRoom } from "./NewRoomModal";

interface RoomProps {
  name: string;
  price: number;
  description?: string;
  image?: string;
  roomCount: number;
  guestsCount: number;
  isOwner: boolean;
  onBook: () => void;
  onEdit: () => void;
}
const Room = ({
  name,
  price,
  description,
  image,
  roomCount,
  guestsCount,
  isOwner,
  onBook,
  onEdit,
}: RoomProps) => {
  return (
    <div className="rounded-xl bg-gray-100 p-4">
      <div className="flex h-fit gap-4">
        <div className="flex-1 ">
          <h2 className="text font-semibold">{name}</h2>
          {description && (
            <div className="mt-1 text-sm text-gray-600">{description}</div>
          )}
          <div className="flex items-center">
            {!!price && (
              <div className="mt-1 text-sm ">
                <div className="text-gray-600">Price for 1 night</div>
                <div className="font-semibold ">{price} zł</div>
              </div>
            )}
          </div>
          {isOwner && (
            <div
              className="mt-1 flex cursor-pointer text-sm font-semibold text-blue-600"
              onClick={onEdit}
            >
              Edit
            </div>
          )}
        </div>
        {image && (
          <div className="h-40 w-24 flex-none overflow-hidden rounded-lg">
            <Img
              src={`/${image}`}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
      <button
        className="mt-4 flex w-full cursor-pointer justify-center rounded-lg border border-blue-600 bg-blue-600 p-2 text-center text-white"
        onClick={onBook}
      >
        Select
      </button>
    </div>
  );
};

const Rooms = () => {
  const [newRoomModalOpen, setNewRoomModalOpen] = useState(false);
  const rooms = useAppSelector((state) => state.places.focused?.rooms);
  const placeId = useAppSelector((state) => state.places.focused?.id);
  const ownerId = useAppSelector((state) => state.places.focused?.createdBy.id);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState<IRoom>();

  const isOwner = user?.id === ownerId;

  const onCloseModalHandler = () => {
    dispatch(fetchPlace(placeId!));
    setNewRoomModalOpen(false);
    setEditing(undefined);
  };

  const onEditRoomHandler = (room: IRoom) => {
    setEditing(room);
    setNewRoomModalOpen(true);
  };

  const onBookRoomHandler = (room: IRoom) => {
    if (!placeId || !room.id) return;
    dispatch(showRoomBookingModal(placeId, room.id));
  };

  return (
    <div className="-mx-2 mt-4 flex flex-col gap-4">
      {rooms?.length === 0 && (
        <h1 className="font-semibold text-gray-400">No rooms yet!</h1>
      )}
      {isOwner && (
        <button
          className="rounded text-sm font-semibold text-gray-400 hover:underline"
          onClick={() => setNewRoomModalOpen(true)}
        >
          Click to add new room.
        </button>
      )}
      {rooms?.map((room) => (
        <Room
          key={room.name}
          name={room.name}
          price={room.price}
          description={room.description}
          image={room.image}
          roomCount={room.roomsCount}
          guestsCount={room.guestsCount}
          isOwner={isOwner}
          onBook={() => onBookRoomHandler(room)}
          onEdit={() => onEditRoomHandler(room)}
        />
      ))}
      {newRoomModalOpen && (
        <NewRoomModal
          placeId={placeId!}
          onClose={onCloseModalHandler}
          editing={editing}
        />
      )}
    </div>
  );
};

export default Rooms;
