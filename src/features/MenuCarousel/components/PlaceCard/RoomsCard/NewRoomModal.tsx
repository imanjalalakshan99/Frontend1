import { useEffect, useState } from "react";
import fetchApi from "utils/fetchApi";
import Modal from "components/Modal";
import Button from "components/Button";
import { useAppDispatch } from "hooks/redux-hooks";
import ImageInput from "components/ImageInput";
import Input from "components/Input";
import { deleteRoom } from "store/places-actions";

export interface IRoom {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  roomsCount: number;
  guestsCount: number;
}

interface Props {
  placeId: string;
  onClose: () => void;
  editing?: IRoom;
}

const NewRoomModal = ({ placeId, onClose, editing }: Props) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [roomsCount, setRoomsCount] = useState("");
  const [guestsCount, setGuestsCount] = useState("");

  const dispatch = useAppDispatch();

  const isNameValid = name.length > 0;
  const isPriceValid = price.length > 0 && Number(price) > 0;
  const isRoomCountValid = roomsCount.length > 0 && Number(roomsCount) > 0;
  const isGuestsCountValid = guestsCount.length > 0 && Number(guestsCount) > 0;

  const isFormValid =
    isNameValid &&
    isPriceValid &&
    isRoomCountValid &&
    isGuestsCountValid &&
    !loading;

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price.toString());
      setRoomsCount(editing.roomsCount.toString());
      setGuestsCount(editing.guestsCount.toString());
      setDescription(editing.description || "");
    }
  }, []);

  const onSubmitHandler = async () => {
    if (!isFormValid) {
      return;
    }
    setLoading(true);
    const room: IRoom = {
      name,
      description,
      price: Number(price),
      roomsCount: Number(roomsCount),
      guestsCount: Number(guestsCount),
    };
    try {
      const formData = new FormData();
      formData.append("room", JSON.stringify(room));
      if (image) {
        formData.append("image", image);
      }
      const url = editing
        ? `/api/place/${placeId}/room/${editing.id}`
        : `/api/place/${placeId}/room`;
      const response = await fetchApi(url, {
        method: editing ? "PUT" : "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    onClose();
  };

  const deleteRoomHandler = async () => {
    if (!placeId || !editing || !editing.id) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (confirm) {
      dispatch(deleteRoom(placeId, editing.id));
      onClose();
    }
  };

  return (
    <Modal className="max-h-full w-full overflow-y-auto border bg-white p-4 shadow-xl xs:w-[400px] xs:rounded">
      <div className="mb-2 flex">
        <h1 className="text-lg font-semibold text-gray-600">Add Room</h1>
      </div>
      <label className=" block text-sm font-medium text-gray-900">
        Choose an image. (optional)
      </label>
      <div className="flex justify-center">
        <ImageInput
          defaultImage={editing?.image}
          file={image}
          onChange={setImage}
          className="my-2 h-40 w-40 overflow-hidden rounded"
        />
      </div>
      <Input
        name="name"
        type="text"
        placeholder="Name"
        value={name}
        onChange={setName}
        isValid={isNameValid}
        errorMessage="Enter a valid name"
        title="Name"
      />
      <label className="my-2 block text-sm font-medium text-gray-900">
        Description
      </label>
      <textarea
        className="h-20 w-full resize-none rounded border px-0.5 text-sm font-semibold text-gray-600"
        id="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Input
        name="price"
        type="number"
        placeholder="Price"
        value={price}
        onChange={setPrice}
        isValid={isPriceValid}
        errorMessage="Enter a valid price"
        title="Price"
      />
      <Input
        name="roomCount"
        type="number"
        placeholder="Number of rooms"
        value={roomsCount}
        onChange={setRoomsCount}
        isValid={isRoomCountValid}
        errorMessage="Enter a valid number of rooms"
        title="Number of rooms"
      />
      <Input
        name="guestsCount"
        type="number"
        placeholder="Maximal number of guests"
        value={guestsCount}
        onChange={setGuestsCount}
        isValid={isGuestsCountValid}
        errorMessage="Enter a valid number of guests"
        title="Maximal number of guests"
      />
      <div className="mt-4 flex justify-end gap-2">
        {editing && (
          <Button
            text="Delete"
            onClick={deleteRoomHandler}
            className="border"
          />
        )}
        <Button text="Cancel" onClick={onClose} className="border" />
        <Button
          text={loading ? "Loading..." : editing ? "Save" : "Add"}
          onClick={onSubmitHandler}
          disabled={!isFormValid}
          className="border"
        />
      </div>
    </Modal>
  );
};

export default NewRoomModal;
