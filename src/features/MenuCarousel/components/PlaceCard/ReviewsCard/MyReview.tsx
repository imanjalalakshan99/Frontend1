import { useEffect, useState } from "react";
import UserAvatar from "components/UserAvatar";
import useApi from "hooks/use-api";
import { ServerResponse } from "utils/fetchApi";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import Rating from "../../Rating";
import { placesActions } from "store/places-slice";
import { IUser } from "types/IUser";
import { IReview } from "types/IReview";

const MyReview = () => {
  const { fetch: upload } = useApi<ServerResponse>("/api/review", {
    method: "PUT",
  });
  const { fetch: remove } = useApi<ServerResponse>("/api/review", {
    method: "DELETE",
  });
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [currentComment, setCurrentComment] = useState("");
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state) => state.places.focused?.reviews);
  const placeId = useAppSelector((state) => state.places.focused?.id);
  const user = useAppSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(false);

  const userId = user?.id;
  const myReview = reviews?.find((review) => review.user.id === userId);
  const { rating, comment } = myReview ?? { rating: 0, comment: "" };

  useEffect(() => {
    if (currentRating > 0 && currentRating !== rating) setEdit(true);
  }, [currentRating]);

  useEffect(() => {
    setCurrentComment(comment ?? "");
    setCurrentRating(rating);
    console.log("rating", rating);
  }, [reviews]);

  const userName = user?.name;

  const onCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 126) setCurrentComment(e.target.value);
  };

  const onSubmit = () => {
    if (currentRating === null || !placeId) return;
    upload({
      rating: currentRating,
      comment: currentComment,
      placeId: placeId,
    });
    const review: IReview = {
      rating: currentRating,
      comment: currentComment,
      user: user ?? ({} as IUser),
    };
    dispatch(placesActions.addReview({ placeId: placeId, review }));
    setEdit(false);
  };

  const onDelete = () => {
    if (currentRating === null || !placeId) return;
    remove({
      placeId: placeId,
    });
    dispatch(
      placesActions.removeReview({
        placeId: placeId,
        userId: user?.id ?? "",
      })
    );
    setEdit(false);
  };

  const onCancelUpdate = () => {
    setEdit(false);
    setCurrentRating(rating ?? 0);
    setCurrentComment(comment ?? "");
  };

  return (
    <div className="p-4">
      <label className="font-medium text-gray-600">
        {edit && "Edit your review"}
        {!edit && (rating ? "Your review:" : "Rate this place:")}
      </label>
      <div className="mt-4 flex w-full">
        <div className="flex-none">
          <UserAvatar name={userName ?? ""} image={user?.profileImage} />
        </div>

        <div className="flex flex-col gap-1 pl-2">
          <h3 className="-mt-1 font-medium text-gray-800">{userName}</h3>
          <Rating rating={currentRating} setRating={setCurrentRating} />
          {!edit && currentComment && (
            <div className="w-full pr-2 text-sm text-gray-800">
              {currentComment}
            </div>
          )}
        </div>
      </div>
      {edit && (
        <>
          <label
            htmlFor="comment"
            className="block py-1 text-sm font-semibold text-gray-400"
          >
            Add a comment:
          </label>
          <textarea
            className="h-20 w-full resize-none rounded border px-0.5 text-sm font-semibold text-gray-600"
            id="comment"
            value={currentComment}
            onChange={onCommentChange}
          />
        </>
      )}
      <div className="flex justify-end gap-2 px-1 pt-1 text-sm font-semibold text-blue-600">
        {edit && (
          <>
            <button className="cursor-pointer" onClick={onCancelUpdate}>
              Cancel
            </button>
            <button className="cursor-pointer" onClick={onSubmit}>
              Submit
            </button>
          </>
        )}
        {!edit && rating > 0 && (
          <>
            <button className="cursor-pointer" onClick={() => setEdit(true)}>
              Edit
            </button>
            <button className="cursor-pointer" onClick={onDelete}>
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReview;
