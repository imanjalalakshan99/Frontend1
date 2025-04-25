import { useEffect, useState } from "react";
import fetchApi from "utils/fetchApi";
import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";
import { BiSolidBookOpen } from "react-icons/bi";
import { useAppDispatch } from "hooks/redux-hooks";
import { deleteMenuItem } from "store/places-actions";
import ImageInput from "components/ImageInput";

export interface IMenuItem {
  id?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface Props {
  placeId: string;
  onClose: () => void;
  editing?: IMenuItem;
}

const NewMenuItemModal = ({ placeId, onClose, editing }: Props) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useAppDispatch();

  const validName = name.length > 0;
  const validPrice = price.length > 0;
  const isFormValid = validName && validPrice && !loading;

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price.toString());
      setDescription(editing.description || "");
    }
  }, []);

  const onSubmitHandler = async () => {
    if (!isFormValid) {
      return;
    }
    setLoading(true);
    const menuItem: IMenuItem = {
      name,
      description,
      price: Number(price),
    };
    try {
      const formData = new FormData();
      formData.append("menu", JSON.stringify(menuItem));
      if (image) {
        formData.append("image", image);
      }
      const url = editing
        ? `/api/place/${placeId}/menu/${editing.id}`
        : `/api/place/${placeId}/menu`;
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

  const deleteMenuItemHandler = async () => {
    if (!editing || !editing.id) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this menu item?"
    );
    if (confirm) {
      dispatch(deleteMenuItem(placeId, editing.id));
      onClose();
    }
  };

  return (
    <Modal className="max-h-full w-full overflow-y-auto border bg-white p-4 shadow-xl xs:w-[400px] xs:rounded">
      <div className="mb-2 flex">
        <BiSolidBookOpen className="mr-4 h-7 w-7" />
        <h1 className="text-lg font-semibold text-gray-600">Add Menu Item</h1>
      </div>
      <label className="text-sm font-medium text-gray-900">
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
        isValid={validName}
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
        isValid={validPrice}
        errorMessage="Enter a valid price"
        title="Price"
      />
      <div className="mt-4 flex justify-end gap-2">
        {editing && (
          <Button
            text="Delete"
            onClick={deleteMenuItemHandler}
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

export default NewMenuItemModal;
