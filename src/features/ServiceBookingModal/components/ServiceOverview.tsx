import Img from "components/Img";
import { useAppSelector } from "hooks/redux-hooks";
import { Link } from "react-router-dom";
import { getTime } from "utils/dateTime";

const getEndTime = (time: string, duration: number) => {
  const endDateTime = new Date(`1970-01-01T${time}:00Z`);
  endDateTime.setMinutes(endDateTime.getMinutes() + duration);
  const dateString = endDateTime.toISOString();
  return getTime(dateString);
};

const ServiceOverview = () => {
  const selected = useAppSelector((state) => state.places.focused);
  const selectedServiceId = useAppSelector((state) => state.book.serviceId);
  const selectedService = selected?.services.find(
    (service) => service.id === selectedServiceId
  );
  const selectedTime = useAppSelector((state) => state.book.selectedTime);
  const duration = selectedService?.duration;

  const endTime =
    selectedTime && duration ? getEndTime(selectedTime, duration) : undefined;

  return (
    <div className="m-6 flex flex-col gap-2 rounded-lg bg-gray-100 p-4">
      <h1 className="text-lg font-bold text-gray-600">
        {selectedService?.name}
      </h1>
      <p className="text-gray-600">{selectedService?.description}</p>
      <div className=" font-semibold text-gray-500">
        {selectedService?.price} zl
      </div>
      <div className="ext-sm flex h-10 font-semibold text-gray-600">
        {selectedTime && `${selectedTime}`}
        {endTime && ` - ${endTime}`}
      </div>
      <Link
        className="flex flex-row items-center"
        to={`/place/${selected?.id}?details=overview`}
      >
        {selected?.thumbnail && (
          <Img
            src={"/" + selected?.thumbnail}
            className="mr-2 h-5 w-5 rounded-full"
          />
        )}
        <h3 className="font-semibold text-gray-600">{selected?.name}</h3>
      </Link>
    </div>
  );
};

export default ServiceOverview;
