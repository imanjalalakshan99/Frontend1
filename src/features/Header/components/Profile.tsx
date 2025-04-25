import UserAvatar from "components/UserAvatar";
import { useAppSelector } from "hooks/redux-hooks";
import Input from "components/Input";
import { useEffect, useState } from "react";
import fetchApi from "utils/fetchApi";
import Modal from "components/Modal";
import { FaRegAddressCard } from "react-icons/fa";
import Button from "components/Button";
import ImageInput from "components/ImageInput";
import { useNavigate } from "react-router";

interface Props {
  onClose: () => void;
}

const Profile = ({ onClose }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validName = name.length >= 3;
  const validPassword = password.length >= 6 || password.length === 0;
  const validForm = validName && validPassword && !loading;

  const onSubmit = async () => {
    if (!validForm) {
      return;
    }
    setLoading(true);
    const profile = {
      name: name.length > 0 ? name.trim() : undefined,
      password: password.length > 0 ? password : undefined,
    };
    try {
      const formData = new FormData();
      formData.append("profile", JSON.stringify(profile));
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const response = await fetchApi(`/api/user/profile`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        try {
          response.json().then((data) => {
            setError(data.message);
          });
        } catch (error: any) {
          throw new Error(error);
        }
      }
      setLoading(false);
      if (response.ok) onClose();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    navigate(0);
  };

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  return (
    <Modal className="max-h-full w-full overflow-y-auto border bg-white p-4 shadow-xl xs:w-[400px] xs:rounded">
      <div className="flex">
        <FaRegAddressCard className="mr-4 h-7 w-7" />
        <h1 className="text-xl font-semibold text-gray-600">
          Edit your profile
        </h1>
      </div>
      <label className="mt-2 block text-sm font-medium text-gray-900">
        Choose an image. (optional)
      </label>
      <div className="flex justify-center">
        <ImageInput
          defaultImage={user?.profileImage}
          file={imageFile}
          onChange={setImageFile}
          className="my-2 h-40 w-40 overflow-hidden rounded-full"
        />
      </div>
      <div className="mt-4 w-full">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          errorMessage="Enter a valid name"
          onChange={setName}
          isValid={validName}
          name="name"
          title="Name"
        />
        <div className="mb-4" />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          errorMessage="Password must be at least 6 characters long"
          onChange={setPassword}
          isValid={validPassword}
          name="password"
          title="Password"
        />
        {error && (
          <div className="text-sm font-semibold text-red-600">{error}</div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button text="Cancel" onClick={() => onClose()} className="border" />
          <Button
            text={!loading ? "Submit" : "Loading..."}
            onClick={onSubmit}
            disabled={!validForm}
            className="border"
          />
        </div>
      </div>
    </Modal>
  );
};

export default Profile;
