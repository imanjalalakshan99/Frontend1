import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { roomBookingActions } from "store/room-slice";
import { sendRoomBookingRequest } from "store/room-actions";
import Modal from "components/Modal";
import Calendar from "./components/Calendar";
import RoomOverview from "./components/RoomOverview";

const RoomBookingModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.room.modalOpen);
  const selectedStartDate = useAppSelector(
    (state) => state.room.selectedStartDate
  );
  const selectedEndDate = useAppSelector((state) => state.room.selectedEndDate);
  const loading = useAppSelector((state) => state.room.loading);
  const message = useAppSelector((state) => state.room.message);
  const errorMessage = useAppSelector((state) => state.room.errorMessage);
  const isEditing = useAppSelector((state) => state.room.isEditing);

  if (!isOpen) return null;
  const formValid = selectedStartDate && selectedEndDate && !loading;

  const onCancelClickHandler = () => {
    dispatch(roomBookingActions.hideModal());
  };
  const onBookClickHandler = () => {
    if (!formValid) return;
    dispatch(sendRoomBookingRequest());
  };
  const ErrorMessage = () => (
    <div className="px-6 pt-4 font-semibold text-red-500">{errorMessage}</div>
  );
  const Message = () => (
    <div className="px-6 pt-4 font-semibold text-green-500">{message}</div>
  );

  return (
    <Modal
      onBackdropClick={onCancelClickHandler}
      className="flex h-full w-full flex-col gap-4 overflow-y-auto border bg-white p-4 shadow-xl xs:h-fit xs:w-[25rem] xs:rounded-xl"
    >
      <Calendar />
      <RoomOverview />
      {errorMessage && <ErrorMessage />}
      {message && <Message />}
      <div className="flex flex-col gap-2">
        <div
          className={`${
            formValid
              ? "cursor-pointer bg-blue-600"
              : "cursor-not-allowed bg-blue-300"
          } box-border rounded-lg py-2 text-center text-white `}
          onClick={onBookClickHandler}
        >
          {!isEditing && (!loading ? "Book" : "Booking...")}
          {isEditing && (!loading ? "Save" : "Saving...")}
        </div>
        <div
          className="box-border cursor-pointer rounded-lg bg-gray-600 py-2 text-center text-white"
          onClick={onCancelClickHandler}
        >
          Cancel
        </div>
      </div>
    </Modal>
  );
};

export default RoomBookingModal;
