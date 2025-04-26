import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { serviceBookingActions } from "store/service-slice";
import Calendar from "./components/Calendar";
import ServiceOverview from "./components/ServiceOverview";
import { sendServiceBookingRequest } from "store/service-actions";
import Modal from "components/Modal";
import { getDateString, getTime } from "utils/dateTime";

const BookingModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.book.modalOpen);
  const selectedDate = useAppSelector((state) => state.book.selectedDate);
  const selectedTime = useAppSelector((state) => state.book.selectedTime);
  const additionalDate = useAppSelector((state) => state.book.additionalDate);
  const loading = useAppSelector((state) => state.book.loading);
  const message = useAppSelector((state) => state.book.message);
  const errorMessage = useAppSelector((state) => state.book.errorMessage);
  const isEditing = useAppSelector((state) => state.book.isEditing);

  if (!isOpen) return null;
  const formValid = !!selectedDate && !!selectedTime && !loading;

  const onCancelClickHandler = () => {
    dispatch(serviceBookingActions.hideModal());
  };
  const onBookClickHandler = () => {
    if (!formValid) return;
    if (additionalDate) {
      const date = getDateString(additionalDate);
      const time = getTime(additionalDate);
      if (date === selectedDate && time === selectedTime) {
        dispatch(serviceBookingActions.hideModal());
        return;
      }
    }
    dispatch(sendServiceBookingRequest());
  };
  const ErrorMessage = () => (
    <div className="mx-6 mt-4 font-semibold text-red-500">{errorMessage}</div>
  );
  const Message = () => (
    <div className="mx-6 mt-4 font-semibold text-green-500">{message}</div>
  );

  return (
    <Modal
      onBackdropClick={onCancelClickHandler}
      className="flex h-full w-full flex-col overflow-y-auto border bg-white shadow-xl xs:h-fit sm:w-[550px] sm:rounded-xl"
    >
      <Calendar />
      <ServiceOverview />
      <div className="mt-4 w-full border-b"></div>
      {errorMessage && <ErrorMessage />}
      {message && <Message />}
      <div
        className={`${
          formValid
            ? "cursor-pointer bg-blue-600"
            : "cursor-not-allowed bg-blue-300"
        } mx-4 mt-4 box-border rounded-lg py-2 text-center text-white `}
        onClick={onBookClickHandler}
      >
        {!isEditing && (!loading ? "Book" : "Booking...")}
        {isEditing && (!loading ? "Save" : "Saving...")}
      </div>
      <div
        className="mx-4 mt-2 box-border cursor-pointer rounded-lg bg-gray-600 py-2 text-center text-white"
        onClick={onCancelClickHandler}
      >
        Cancel
      </div>
      <div className="mt-4"></div>
    </Modal>
  );
};

export default BookingModal;
