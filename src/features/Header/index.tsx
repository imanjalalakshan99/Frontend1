import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { businessActions } from "store/business-slice";
import Dropdown, { DropdownButton } from "./components/Dropdown";
import { useState } from "react";
import Profile from "./components/Profile";
import SignInButton from "./components/SignInButton";
import Notifications from "./components/Notifications";
import { BiBookContent, BiLogOut } from "react-icons/bi";
import { DateTime } from "luxon";
import { HiUser } from "react-icons/hi";
import { IoCreateOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { PiMapPinBold } from "react-icons/pi";
import UserAvatar from "components/UserAvatar";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  const reservations = useAppSelector(
    (state) => state.reservations.reservations
  );
  const noOfNotifications = reservations.reduce((acc, curr) => {
    const minutes = curr.service ? curr.service.duration : 0;
    const days = curr.room ? curr.room.length : 0;
    const isDone =
      DateTime.fromISO(curr.date).plus({ minutes, days }) < DateTime.now();
    if (!isDone) acc++;
    return acc;
  }, 0);

  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const onSignOutHandler = () => {
    navigate("/logout");
  };
  const onSignInHandler = () => {
    navigate("/login");
  };
  const onReservationsHandler = () => {
    navigate("/reservations");
  };
  const onOpenBusinessModalHandler = () => {
    navigate("/");
    dispatch(businessActions.showModal());
  };

  return (
    <NavBar>
      {user && (
        <>
          <li
            className="relative h-fit cursor-pointer"
            onClick={onReservationsHandler}
          >
            {noOfNotifications > 0 && (
              <Notifications number={noOfNotifications} />
            )}
            <div className="hidden px-2 py-1 font-semibold text-white xs:block">
              Reservations
            </div>
            <BiBookContent className="mx-2 my-1 h-6 w-6 text-white xs:hidden" />
          </li>
          <Dropdown>
            <div className="flex p-4 text-sm text-gray-900 ">
              <UserAvatar
                name={user?.name || ""}
                image={user?.profileImage}
                className="mr-4 h-10 w-10 bg-pink-600 !text-base"
              />
              <div>
                <div className="font-semibold">{user.name}</div>
                <div>{user.email}</div>
              </div>
            </div>
            <ul className="py-2 ">
              <DropdownButton
                Icon={BiBookContent}
                text="Reservations"
                onClick={onReservationsHandler}
              />
              <DropdownButton
                Icon={FaRegAddressCard}
                text="Edit profile"
                onClick={() => setShowModal(true)}
              />
              <DropdownButton
                Icon={PiMapPinBold}
                text="Create business"
                onClick={onOpenBusinessModalHandler}
              />
            </ul>
            <ul className="py-2 ">
              <DropdownButton
                Icon={BiLogOut}
                text="Sign out"
                onClick={onSignOutHandler}
              />
            </ul>
          </Dropdown>
        </>
      )}
      {!user && <SignInButton onClick={onSignInHandler} />}
      {user && showModal && <Profile onClose={() => setShowModal(false)} />}
    </NavBar>
  );
};

export default Header;
export { NavBar };
