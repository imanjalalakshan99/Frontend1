import { IPlace } from "types/IPlace";
import { placesActions } from "store/places-slice";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import Rating from "../Rating";
import Img from "components/Img";
import SearchInput from "./SearchInput";
import { IoFilterSharp } from "react-icons/io5";

interface ResultProps {
  onClick: () => void;
  name: string;
  description?: string;
  thumbnail: string;
  rating?: number;
  numberOfReviews: number;
}

const Result = ({
  onClick,
  name,
  description,
  thumbnail,
  rating,
  numberOfReviews,
}: ResultProps) => {
  return (
    <div
      className="flex cursor-pointer justify-between gap-4 text-gray-600 hover:bg-gray-50"
      onClick={onClick}
    >
      <div>
        <div className="text-lg font-semibold text-gray-800">{name}</div>
        {!!rating && numberOfReviews > 0 && (
          <Rating rating={rating} numberOfReviews={numberOfReviews} />
        )}
        {numberOfReviews === 0 && (
          <div className="pb-1 text-sm font-medium text-gray-400">
            No reviews yet!
          </div>
        )}
        {description && (
          <div className="mt-0.5 text-xs font-medium text-gray-400 line-clamp-2">
            {description}
          </div>
        )}
      </div>
      <Img
        src={`/${thumbnail}`}
        alt=""
        className="h-24 w-24 rounded object-cover"
      />
    </div>
  );
};

interface Props {
  onFiltersClick: () => void;
}

const ResultsList = ({ onFiltersClick }: Props) => {
  const results = useAppSelector((state) => state.places.places);
  const focused = useAppSelector((state) => state.places.focused);
  const dispatch = useAppDispatch();

  const onClickHandle = (result: IPlace) => {
    dispatch(placesActions.setFocused(result));
  };

  return (
    <div className="p-4">
      <div className="flex w-full">
        <button
          className={
            "mr-4 items-center " + (!focused ? "lg:hidden" : "xl:hidden")
          }
          onClick={onFiltersClick}
        >
          <IoFilterSharp className="h-7 w-7" />
        </button>
        <SearchInput />
      </div>
      <ul className="my-4 flex w-full flex-shrink flex-grow flex-col gap-4 overflow-auto">
        {results.map((result) => {
          return (
            <li key={result.id}>
              <Result
                name={result.name}
                description={result.description}
                thumbnail={result.thumbnail}
                rating={result.rating}
                onClick={() => onClickHandle(result)}
                numberOfReviews={result.reviews.length}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default ResultsList;
