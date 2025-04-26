import fetchApi from "utils/fetchApi";
import { AppThunk } from ".";
import IBusiness from "types/IBusiness";
import { businessActions } from "./business-slice";
import { fetchPlace } from "./places-actions";

export const postBusiness = (
  business: IBusiness,
  thumbnail: File,
  images: File[]
): AppThunk => {
  return async (dispatch) => {
    dispatch(businessActions.setLoading(true));
    try {
      const formData = new FormData();
      formData.append("business", JSON.stringify(business));
      formData.append("thumbnail", thumbnail);
      if (images) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }
      const response = await fetchApi("/api/user/business", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const placeId = data.placeId;
      dispatch(businessActions.hideModal());
      dispatch(fetchPlace(placeId));
    } catch (error) {
      console.log(error);
    }
    dispatch(businessActions.setLoading(false));
  };
};

export const updateBusiness = (
  business: IBusiness & { id: string },
  thumbnail?: File,
  images?: File[]
): AppThunk => {
  return async (dispatch) => {
    dispatch(businessActions.setLoading(true));
    try {
      const formData = new FormData();
      formData.append("business", JSON.stringify(business));
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (images) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }
      const response = await fetchApi(`/api/place/${business.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const placeId = data.placeId;
      dispatch(businessActions.hideModal());
      dispatch(fetchPlace(placeId));
    } catch (error) {
      console.log(error);
    }
    dispatch(businessActions.setLoading(false));
  };
};
