import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import Input from "components/Input";
import TimeSelector from "./components/TimeSelector";
import IOpeningHours from "types/IOpeningHours";
import { useEffect, useState } from "react";
import Map from "./components/Map";
import { businessActions } from "store/business-slice";
import { postBusiness, updateBusiness } from "store/business-actions";
import IBusiness from "types/IBusiness";
import TypeSelector from "./components/TypeSelector";
import Modal from "components/Modal";
import { deletePlace } from "store/places-actions";
import { isTimeGreater } from "utils/dateTime";
import Img from "components/Img";
import { PiMapPinBold } from "react-icons/pi";
import Button from "components/Button";

const BusinessModal = () => {
  const dispatch = useAppDispatch();
  const isEditing = useAppSelector((state) => state.business.editing);
  const editingBusiness = useAppSelector((state) => state.business.subject);

  const loading = useAppSelector((state) => state.business.loading);
  const [coordinates, setCoordinates] = useState<
    [number, number] | undefined
  >();
  const [name, setName] = useState("");
  const [thumbnail, setThumbnails] = useState<File | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("hotel");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [tags, setTags] = useState("");
  const [includeHours, setIncludeHours] = useState(true);

  const [openingHours, setOpeningHours] = useState<IOpeningHours[]>(
    [...Array(7)].map((_, i) => {
      return {
        dayOfWeek: i,
        from: "09:00",
        to: "17:00",
      };
    })
  );

  useEffect(() => {
    if (isEditing) {
      if (!editingBusiness) return;
      setName(editingBusiness.name);
      setDescription(editingBusiness.description || "");
      setType(editingBusiness.type);
      setAddress(editingBusiness.address || "");
      setPhone(editingBusiness.contactInfo.phone || "");
      setTags(editingBusiness.tags ? editingBusiness.tags.join(" ") : "");
      setOpeningHours(editingBusiness.openingHours);
      const coordinates = editingBusiness.location.coordinates;
      setCoordinates([coordinates[1], coordinates[0]]);
      setIncludeHours(editingBusiness.showOpeningHours);
    }
  }, []);

  const isValidName = name.length > 0;
  const isValidDescription = description.length > 0;
  const isValidType = type.length > 0;
  const isValidAddress = address.length > 0;
  const isValidPhone = phone.length === 9;
  const isValidTags = tags.length > 0;
  const isValidThumbnail = !!thumbnail || !!editingBusiness?.thumbnail;
  const isValidTime = openingHours.every((c) => {
    return (
      (c.from == "--:--" && c.to === "--:--") || isTimeGreater(c.to, c.from)
    );
  });
  const isFormValid =
    isValidName &&
    isValidDescription &&
    isValidType &&
    isValidAddress &&
    isValidPhone &&
    isValidTags &&
    isValidTime &&
    isValidThumbnail &&
    !!coordinates &&
    !loading;

  const setHours = (value: IOpeningHours) => {
    const newHours = openingHours.map((current) => {
      if (current.dayOfWeek === value.dayOfWeek) {
        return value;
      }
      return current;
    });
    setOpeningHours(newHours);
  };
  const setTagsHandler = (value: string) => {
    setTags(value.replace(/[^a-zA-Z0-9 ]/g, ""));
  };
  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setThumbnails(file);
  };
  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) setImages([]);
    else setImages([...files]);
  };
  const onCancelHandler = () => {
    dispatch(businessActions.hideModal());
  };
  const onSubmitHandler = () => {
    if (!isFormValid) return;
    const hours = openingHours.reduce((acc, current) => {
      if (current.from !== "--:--" && current.to !== "--:--") {
        acc.push(current);
      }
      return acc;
    }, [] as IOpeningHours[]);
    const business: IBusiness = {
      name: name.trim(),
      description: description.trim(),
      type,
      address: address.trim(),
      phone: phone.trim(),
      tags: tags.split(" "),
      openingHours: hours,
      showOpeningHours: includeHours,
      location: {
        type: "Point",
        coordinates: [coordinates[1], coordinates[0]],
      },
    };
    if (!isEditing && thumbnail) {
      dispatch(postBusiness(business, thumbnail, images));
    }
    if (isEditing) {
      dispatch(
        updateBusiness(
          { ...business, id: editingBusiness!.id },
          thumbnail,
          images
        )
      );
    }
  };
  const onDeletePlaceHandler = () => {
    if (!editingBusiness) return;
    const confirm = window.confirm(
      `Are you sure you want to delete ${editingBusiness.name}?`
    );
    if (!confirm) return;
    dispatch(deletePlace(editingBusiness.id));
  };

  return (
    <Modal className="box-border max-h-full w-full flex-col gap-4 overflow-y-auto border bg-white p-4 shadow-xl first:flex xs:w-[450px] xs:rounded md:w-[700px] md:flex-row">
      <div className="w-full md:w-1/2">
        <div className="mb-4 flex">
          <PiMapPinBold className="mr-4 h-7 w-7" />
          <h1 className="text-xl font-semibold text-gray-600">
            Let's Get Started
          </h1>
        </div>
        <Input
          type="text"
          placeholder="Business Name"
          value={name}
          errorMessage="Name is required"
          onChange={setName}
          isValid={isValidName}
          name="business-name"
          title="Business Name"
        />
        <TypeSelector value={type} onChange={setType} />
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-900"
        >
          Description
        </label>
        <textarea
          className="h-20 w-full resize-none rounded border px-0.5 text-sm font-semibold text-gray-600"
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <Input
          type="text"
          placeholder="London, UK"
          value={address}
          errorMessage="Address is required"
          onChange={setAddress}
          isValid={isValidAddress}
          name="address"
          title="Address"
        />
        <Input
          type="number"
          placeholder="123456789"
          value={phone}
          errorMessage="Please enter a valid phone number"
          onChange={setPhone}
          isValid={isValidPhone}
          name="phone"
          title="Phone number"
        />

        <label className="mt-2 block text-sm font-medium text-gray-900">
          Select opening hours
        </label>
        <div className="mx-2 mt-2 flex flex-col gap-0.5 text-sm">
          {openingHours.map((hours) => {
            return (
              <TimeSelector
                key={hours.dayOfWeek}
                value={hours}
                onChange={(value) => setHours(value)}
              />
            );
          })}
        </div>
        <div className="mt-2 flex items-center">
          <label
            htmlFor="default-checkbox"
            className="mr-2 text-sm font-medium text-gray-900 "
          >
            Show opening hours
          </label>
          <input
            id="default-checkbox"
            type="checkbox"
            checked={includeHours}
            onChange={(event) => setIncludeHours(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
          />
        </div>
      </div>
      <div className=" md:w-1/2">
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Choose a thumbnail
        </label>
        <div className="relative flex h-40 items-center justify-center overflow-hidden rounded">
          {!thumbnail && editingBusiness?.thumbnail && (
            <Img
              src={`/${editingBusiness.thumbnail}`}
              alt="business"
              className="h-full w-full object-cover"
            />
          )}
          {thumbnail && (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="business"
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[#0000006c] font-bold text-white">
            Click to select file.
          </div>
          <input
            type="file"
            accept=".jpeg,.jpg,.png,.gif"
            onChange={handleThumbnailChange}
            className="absolute z-20 h-full w-full cursor-pointer opacity-0"
            multiple={false}
          />
        </div>
        <label className="mt-2 mb-2 block text-sm font-medium text-gray-900">
          Add some more photos
        </label>
        <input
          type="file"
          accept=".jpeg,.jpg,.png,.gif"
          onChange={handleImagesChange}
          className="z-20 w-full cursor-pointer"
          multiple={true}
        />
        <label className="mt-2 mb-2 block text-sm font-medium text-gray-900">
          Pick a location
        </label>
        <Map coordinates={coordinates} setCoordinates={setCoordinates} />
        <div className="mt-2"></div>
        <Input
          type="text"
          placeholder="Separate tags with spaces e.g. hotel restaurant"
          value={tags}
          errorMessage=""
          onChange={setTagsHandler}
          isValid={isValidTags}
          name="tags"
          title="Tags"
        />
        <div className="mt-4 flex justify-end gap-2">
          {isEditing && (
            <Button
              text="Delete"
              onClick={onDeletePlaceHandler}
              className="border"
            />
          )}
          <Button text="Cancel" onClick={onCancelHandler} className="border" />
          <Button
            text={!loading ? "Submit" : "Loading..."}
            onClick={onSubmitHandler}
            disabled={!isFormValid}
            className="border"
          />
        </div>
      </div>
    </Modal>
  );
};

export default BusinessModal;
