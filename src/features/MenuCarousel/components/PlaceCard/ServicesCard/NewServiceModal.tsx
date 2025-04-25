import { useEffect, useState } from "react";
import fetchApi from "utils/fetchApi";
import Modal from "components/Modal";
import Button from "components/Button";
import { useAppDispatch } from "hooks/redux-hooks";
import { deleteService } from "store/places-actions";
import ImageInput from "components/ImageInput";
import { HiOutlinePlus, HiPlus } from "react-icons/hi";
import Input from "components/Input";

export interface IService {
  id?: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  image?: string;
}

interface Props {
  placeId: string;
  onClose: () => void;
  editing?: IService;
}

const NewServiceModal = ({ placeId, onClose, editing }: Props) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useAppDispatch();

  const isNameValid = name.length > 0;
  const isPriceValid = price.length > 0;
  const isDurationValid = duration.length > 0;

  const isFormValid =
    isNameValid && isPriceValid && isDurationValid && !loading;

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price.toString());
      setDuration(editing.duration?.toString() || "");
      setDescription(editing.description || "");
    }
  }, []);

  const onSubmitHandler = async () => {
    if (!isFormValid) {
      return;
    }
    setLoading(true);
    const service: IService = {
      name,
      description,
      price: Number(price),
      duration: Number(duration),
    };
    try {
      const formData = new FormData();
      formData.append("service", JSON.stringify(service));
      if (image) {
        formData.append("image", image);
      }
      const url = editing
        ? `/api/place/${placeId}/service/${editing.id}`
        : `/api/place/${placeId}/service`;
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

  const deleteServiceHandler = async () => {
    if (!placeId || !editing || !editing.id) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (confirm) {
      dispatch(deleteService(placeId, editing.id));
      onClose();
    }
  };

  return (
    <Modal className="max-h-full w-full overflow-y-auto border bg-white p-4 shadow-xl xs:w-[400px] xs:rounded">
      <div className="mb-2 flex">
        <h1 className="text-lg font-semibold text-gray-600">Add Service</h1>
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
        name="duration"
        type="number"
        placeholder="Duration"
        value={duration}
        onChange={setDuration}
        isValid={isDurationValid}
        errorMessage="Enter a valid duration"
        title="Duration"
      />
      <div className="mt-4 flex justify-end gap-2">
        {editing && (
          <Button
            text="Delete"
            onClick={deleteServiceHandler}
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

export default NewServiceModal;
