import Img from "components/Img";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { useState } from "react";
import { showServiceBookingModal } from "store/service-actions";
import NewServiceModal, { IService } from "./NewServiceModal";
import { fetchPlace } from "store/places-actions";

interface ServiceProps {
  name: string;
  price?: number;
  description?: string;
  image?: string;
  duration?: number;
  isOwner: boolean;
  onBook: () => void;
  onEdit: () => void;
}
const Service = ({
  name,
  price,
  description,
  image,
  duration,
  isOwner,
  onBook,
  onEdit,
}: ServiceProps) => {
  return (
    <div className="flex">
      <div className="flex-1">
        <div className="text font-semibold text-gray-700">{name}</div>
        <div className="flex items-center">
          {!!price && (
            <div className="mr-2 w-10 text-sm text-gray-500">{price} zl</div>
          )}
          <button
            className="my-0.5 rounded bg-blue-600 px-2 text-sm font-semibold text-white"
            onClick={onBook}
          >
            Book
          </button>
        </div>
        {description && (
          <div className="text-sm text-gray-400">{description}</div>
        )}
        {isOwner && (
          <div
            className="flex cursor-pointer text-sm font-semibold text-blue-600"
            onClick={onEdit}
          >
            Edit
          </div>
        )}
      </div>
      {image && (
        <div className="h-20 w-24 ">
          <Img
            src={`/${image}`}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

const Services = () => {
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const services = useAppSelector((state) => state.places.focused?.services);
  const placeId = useAppSelector((state) => state.places.focused?.id);
  const ownerId = useAppSelector((state) => state.places.focused?.createdBy.id);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState<IService>();

  const isOwner = user?.id === ownerId;

  const onCloseModalHandler = () => {
    dispatch(fetchPlace(placeId!));
    setNewServiceModalOpen(false);
    setEditing(undefined);
  };

  const onEditServiceHandler = (service: IService) => {
    setEditing(service);
    setNewServiceModalOpen(true);
  };

  const onBookServiceHandler = (service: IService) => {
    if (!placeId || !service.id) return;
    dispatch(showServiceBookingModal(placeId, service.id));
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      {services?.length === 0 && (
        <h1 className="font-semibold text-gray-400">No services yet!</h1>
      )}
      {isOwner && (
        <button
          className="rounded text-sm font-semibold text-gray-400 hover:underline"
          onClick={() => setNewServiceModalOpen(true)}
        >
          Click to add new service.
        </button>
      )}
      {services?.map((service) => (
        <Service
          key={service.name}
          name={service.name}
          price={service.price}
          description={service.description}
          image={service.image}
          duration={service.duration}
          isOwner={isOwner}
          onEdit={() => onEditServiceHandler(service)}
          onBook={() => onBookServiceHandler(service)}
        />
      ))}
      {newServiceModalOpen && (
        <NewServiceModal
          placeId={placeId!}
          onClose={onCloseModalHandler}
          editing={editing}
        />
      )}
    </div>
  );
};

export default Services;
