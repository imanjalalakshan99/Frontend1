import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { reservationsActions } from "store/reservations-slice";
import { Link } from "react-router-dom";
import Item from "./Item";

interface FilterProps {
  onClick: () => void;
  selected: boolean;
  text: string;
}
const Filter = ({ onClick, selected, text }: FilterProps) => {
  return (
    <div
      className={
        "cursor-pointer rounded py-1 px-2 text-sm font-semibold" +
        (selected ? " bg-gray-700 text-white" : " bg-gray-200 text-black")
      }
      onClick={onClick}
    >
      {text}
    </div>
  );
};

const List = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const reservations = useAppSelector(
    (state) => state.reservations.reservations
  );
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.reservations.filter);
  const setFilter = (id: string | undefined) => {
    dispatch(reservationsActions.setFilter(id));
  };
  const businesses = reservations.reduce((acc, curr) => {
    const business = acc.find((b) => b.id === curr.place.id);
    if (!business && curr.user) {
      acc.push({
        id: curr.place.id,
        name: curr.place.name,
        address: curr.place.address,
      });
    }
    return acc;
  }, [] as { id: string; name: string; address?: string }[]);

  return (
    <div className="relative h-full max-h-full w-full flex-shrink-0 flex-grow-0 sm:w-[400px]">
      <div className="absolute top-0 left-0 bottom-0 right-0 flex flex-col overflow-auto bg-[#fcfcfc]">
        {businesses && businesses.length > 0 && (
          <div className="no-scrollbar mt-4 flex w-full gap-2 px-4 ">
            <Filter
              onClick={() => setFilter(undefined)}
              selected={filter === undefined}
              text="Your reservations"
            />
            {businesses &&
              businesses.length > 0 &&
              businesses.map((business) => {
                return (
                  <Filter
                    key={business.id}
                    onClick={() => setFilter(business.id)}
                    selected={filter === business.id}
                    text={business.name}
                  />
                );
              })}
          </div>
        )}
        {filter === undefined && (
          <>
            {reservations.length > 0 && (
              <h1 className="mx-4 mt-4 font-bold text-gray-800">
                Your reservations:
              </h1>
            )}
            {reservations.length === 0 && (
              <h1 className="mx-4 mt-4 text-lg font-semibold text-gray-600">
                No reservations yet{" "}
                <Link to="/" className="text-blue-600">
                  Book something now {":)"}
                </Link>
              </h1>
            )}
          </>
        )}

        {filter === undefined && (
          <div className="m-4 flex flex-col gap-4">
            {reservations
              .filter(
                (reservation) =>
                  !reservation.user || reservation.user.id === userId
              )
              .map((reservation) => (
                <Item reservation={reservation} key={reservation.id} />
              ))}
          </div>
        )}
        {filter !== undefined &&
          businesses.length > 0 &&
          businesses
            .filter((b) => b.id === filter)
            .map((b) => (
              <div className="mx-4 flex items-baseline ">
                <h1 className="mr-2 text-lg font-semibold ">{b.name}</h1>
                <div className=" text-sm text-gray-400">{b.address}</div>
              </div>
            ))}
        <div className="m-4 flex flex-col gap-4">
          {reservations
            .filter(
              (reservation) =>
                reservation.user && reservation.place.id === filter
            )
            .map((reservation) => (
              <Item reservation={reservation} key={reservation.id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default List;
