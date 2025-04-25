import { useAppSelector } from "hooks/redux-hooks";
import Rating from "../../Rating";
import UserAvatar from "components/UserAvatar";
import MyReview from "./MyReview";

interface ReviewProps {
  image?: string;
  name: string;
  rating: number;
  comment?: string;
}

const Review = ({ image, name, rating, comment }: ReviewProps) => {
  return (
    <div className="flex w-full p-4">
      <div className="flex-none">
        <UserAvatar name={name} image={image} />
      </div>

      <div className="flex flex-col gap-1 pl-2">
        <h3 className="-mt-1 font-medium text-gray-800">{name}</h3>
        <Rating rating={rating} />
        {comment && (
          <div className="w-full pr-2 pt-0.5 text-sm text-gray-800">
            {comment}
          </div>
        )}
      </div>
    </div>
  );
};

const Reviews = () => {
  const reviews = useAppSelector((state) => state.places.focused?.reviews);
  const user = useAppSelector((state) => state.auth.user);

  const userId = user?.id;
  const otherReviews = reviews?.filter((review) => review.user.id !== userId);

  return (
    <>
      {!userId && (
        <div className="mt-4 cursor-pointer font-medium text-gray-600">
          Log in to leave a review
        </div>
      )}
      <div className="-mx-4 flex flex-col divide-y-[1px]">
        {userId && <MyReview />}

        {otherReviews?.map((review) => (
          <Review
            image={review.user.profileImage}
            key={review.user.id}
            name={review.user.name}
            rating={review.rating}
            comment={review.comment}
          />
        ))}
        {!otherReviews && (
          <div className="w-full text-center text-gray-400">
            No reviews yet!
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
