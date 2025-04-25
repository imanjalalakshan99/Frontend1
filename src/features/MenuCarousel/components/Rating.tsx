import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
interface Props {
  rating: number;
  setRating?: (rating: number) => void;
  numberOfReviews?: number;
}

const Rating = ({ rating, setRating, numberOfReviews }: Props) => {
  const [preview, setPreview] = useState(rating);
  const roundedToTenth = Math.round(preview * 10) / 10;
  const roundedToTenthString =
    roundedToTenth.toString().length === 1
      ? roundedToTenth + ".0"
      : roundedToTenth.toString();

  useEffect(() => {
    setPreview(rating);
  }, [rating]);

  const star = (i: number) => {
    if (preview - i > 0.66) {
      return <FaStar />;
    } else if (preview - i > 0.33) {
      return <FaStarHalfAlt />;
    } else {
      return <FaRegStar />;
    }
  };

  const onHover = (i: number) => {
    if (setRating) setPreview(i);
  };

  const onClick = () => {
    if (setRating) setRating(preview);
  };

  const onMouseLeaveHandler = () => {
    if (setRating) setPreview(rating);
  };

  return (
    <div className="flex items-center">
      <div className="relative flex w-5 items-center">
        <span className="absolute font-semibold text-gray-400">
          {roundedToTenth > 0 ? roundedToTenthString : ""}
        </span>
      </div>
      <div
        className="flex"
        onClick={onClick}
        onMouseLeave={onMouseLeaveHandler}
      >
        <div className="relative h-fit w-fit">
          <div
            className={`${
              setRating ? "ml-3 !scale-110 cursor-pointer" : "ml-2"
            } z-10  flex h-fit w-fit  items-center`}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`${
                  preview === rating ? "text-yellow-400" : "text-yellow-500"
                }`}
                onMouseOver={() => onHover(i + 1)}
              >
                {star(i)}
              </div>
            ))}
          </div>
        </div>
      </div>
      {numberOfReviews && (
        <span className="ml-1 font-semibold text-gray-400">
          ({numberOfReviews})
        </span>
      )}
    </div>
  );
};
export default Rating;
