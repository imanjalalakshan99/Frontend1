import Header from "features/Header";
import { useAppSelector } from "hooks/redux-hooks";
import { useAppNavigate } from "hooks/use-navigate";
import { useEffect } from "react";
import { List } from "features/Reservations";
import { ReservationsMap } from "features/Map";
import BusinessModal from "features/BusinessModal";
import ServiceBookingModal from "features/ServiceBookingModal";
import RoomBookingModal from "features/RoomBookingModal";

const Reservations = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLogged);
  const navigate = useAppNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <div className="fixed left-0 right-0 bottom-0 top-0 flex flex-col">
      <Header />
      <div className="relative flex flex-1 flex-col-reverse xs:flex-row">
        <ReservationsMap />
        <List />
      </div>
      <ServiceBookingModal />
      <RoomBookingModal />
    </div>
  );
};

export default Reservations;
