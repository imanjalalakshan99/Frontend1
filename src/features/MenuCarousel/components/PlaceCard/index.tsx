import { IPlace } from "types/IPlace";
import Rating from "../Rating";
import { useSearchParams } from "react-router-dom";
import Services from "./ServicesCard";
import Reviews from "./ReviewsCard";
import Overview from "./Overview";
import { useEffect, useMemo, useRef } from "react";
import Menu from "./MenuCard";
import Img from "components/Img";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { businessActions } from "store/business-slice";
import Rooms from "./RoomsCard";

interface ButtonProps {
  text: string;
  onClick: () => void;
  active?: boolean;
}
const CarouselButton = ({ text, onClick, active }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`box-border flex-grow py-3 px-1 font-semibold ${
        active
          ? "border-b-2 border-blue-500 text-blue-500 hover:bg-blue-100"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {text}
    </button>
  );
};

interface Props {
  place: IPlace;
  minimized: boolean;
}

const Place = ({ minimized, place }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const ownerId = useAppSelector((state) => state.places.focused?.createdBy.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const isOwner = user?.id === ownerId;

  const isMenuAvailable =
    place.menu?.length > 0 || place.createdBy.id === user?.id;
  const areServicesAvailable =
    place.services?.length > 0 || place.createdBy.id === user?.id;
  const areRoomsAvailable =
    place.rooms?.length > 0 || place.createdBy.id === user?.id;

  const activePage = useMemo(() => {
    const page = searchParams.get("details");
    if (!page) return "overview";
    if (page === "menu" && isMenuAvailable) return "menu";
    if (page === "services" && areServicesAvailable) return "services";
    if (page === "reviews") return "reviews";
    if (page === "rooms" && areRoomsAvailable) return "rooms";
    return "overview";
  }, [searchParams, place]);

  const getOnClickPageHandler = (pageName: string) => () => {
    setSearchParams((params) => {
      const p = Object.fromEntries(params.entries());
      return { ...p, details: pageName };
    });
  };

  const isActive = (pageName: string) => {
    return pageName === activePage;
  };

  const onEditHandler = () => {
    if (!place.id || !isOwner) return;
    dispatch(businessActions.setEditing(place));
  };

  return (
    <div
      className={
        "" +
        (minimized
          ? "pt-0 pb-[200px] xs:pt-[200px] xs:pb-0"
          : "pb-0 pt-[200px]")
      }
    >
      <div className="relative h-0 w-full">
        <Img
          src={`/${place.thumbnail}`}
          className={
            "absolute bottom-0 left-0 w-full object-cover" +
            (minimized ? "h-0 xs:h-[200px]" : "h-[200px]")
          }
        />
      </div>
      <div className="p-4">
        <h1 className="pb-1 text-2xl font-semibold text-gray-600">
          {place.name}
        </h1>
        {isOwner && (
          <button
            className="flex cursor-pointer pb-1 text-sm font-semibold text-blue-600"
            onClick={onEditHandler}
          >
            Edit
          </button>
        )}
        {!!place.rating && place.reviews.length > 0 && (
          <Rating
            rating={place.rating}
            numberOfReviews={place.reviews.length}
          />
        )}
        {!place.rating && <div className="text-gray-400">No reviews yet!</div>}
        <p className="pt-1 text-sm font-medium text-gray-500">
          {place.description}
        </p>
        <div className="-mx-4 flex justify-evenly overflow-auto border-b pt-1">
          <div className="w-4"></div>
          <CarouselButton
            text={"Overview"}
            onClick={getOnClickPageHandler("overview")}
            active={isActive("overview")}
          />
          {isMenuAvailable && (
            <CarouselButton
              text={"Menu"}
              onClick={getOnClickPageHandler("menu")}
              active={isActive("menu")}
            />
          )}
          {areServicesAvailable && (
            <CarouselButton
              text={"Services"}
              onClick={getOnClickPageHandler("services")}
              active={isActive("services")}
            />
          )}
          {areRoomsAvailable && (
            <CarouselButton
              text={"Rooms"}
              onClick={getOnClickPageHandler("rooms")}
              active={isActive("rooms")}
            />
          )}
          <CarouselButton
            text={"Reviews"}
            onClick={getOnClickPageHandler("reviews")}
            active={isActive("reviews")}
          />
          <div className="w-4"></div>
        </div>
        {activePage === "menu" && <Menu />}
        {activePage === "services" && <Services />}
        {activePage === "reviews" && <Reviews />}
        {activePage === "overview" && <Overview />}
        {activePage === "rooms" && <Rooms />}
      </div>
    </div>
  );
};

export default Place;
