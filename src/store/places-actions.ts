import { AppThunk } from ".";
import { IPlace } from "../types/IPlace";
import fetchApi from "../utils/fetchApi";
import { placesActions } from "./places-slice";

export const fetchPlaces = (
  searchQuery: string,
  priceFrom?: string,
  priceTo?: string,
  type?: string
): AppThunk => {
  return async (dispatch, getState) => {
    const searchParams = new URLSearchParams();
    searchParams.append("search", searchQuery);
    if (priceFrom) {
      searchParams.append("priceFrom", priceFrom.toString());
    }
    if (priceTo) {
      searchParams.append("priceTo", priceTo.toString());
    }
    if (type) {
      searchParams.append("type", type);
    }
    const fetchData = async () => {
      const url = `/api/place/search?${searchParams.toString()}`;
      const response = await fetchApi(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Could not fetch places!");
      }
      const data = await response.json();
      return data;
    };
    try {
      const placesData = (await fetchData()) as IPlace[];
      console.log(placesData);
      dispatch(placesActions.setPlaces(placesData));
    } catch (error) {
      dispatch(placesActions.setPlaces([]));
    }
  };
};

export const fetchPlace = (placeId: string): AppThunk => {
  return async (dispatch, getState) => {
    const fetchData = async () => {
      const response = await fetchApi(`/api/place/${placeId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Could not fetch place!");
      }
      const data = await response.json();
      return data;
    };
    try {
      const placeData = (await fetchData()) as IPlace;
      dispatch(placesActions.addPlace(placeData));
      dispatch(placesActions.setFocused(placeData));
    } catch (error) {
      console.log(error);
    }
  };
};

export const navigateToPlace = (placeId: string): AppThunk => {
  return async (dispatch, getState) => {
    const place = getState().places.places.find(
      (place) => place.id === placeId
    );
    if (place) {
      dispatch(placesActions.setFocused(place));
    } else {
      dispatch(fetchPlace(placeId));
    }
  };
};

export const deleteService = (placeId: string, serviceId: string): AppThunk => {
  return async (dispatch, getState) => {
    const fetchData = async () => {
      const response = await fetchApi(
        `/api/place/${placeId}/service/${serviceId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Could not delete service!");
      }
      const data = await response.json();
      return data;
    };
    try {
      await fetchData();
      dispatch(fetchPlace(placeId));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteRoom = (placeId: string, roomId: string): AppThunk => {
  return async (dispatch, getState) => {
    const fetchData = async () => {
      const response = await fetchApi(
        `/api/place/${placeId}/service/${roomId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Could not delete room!");
      }
      const data = await response.json();
      return data;
    };
    try {
      await fetchData();
      dispatch(fetchPlace(placeId));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteMenuItem = (
  placeId: string,
  menuItemId: string
): AppThunk => {
  return async (dispatch, getState) => {
    const fetchData = async () => {
      const response = await fetchApi(
        `/api/place/${placeId}/menu/${menuItemId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Could not delete menu item!");
      }
      const data = await response.json();
      return data;
    };
    try {
      await fetchData();
      dispatch(fetchPlace(placeId));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deletePlace = (placeId: string): AppThunk => {
  return async (dispatch, getState) => {
    try {
      const response = await fetchApi(`/api/place/${placeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Could not delete place!");
      }
      const data = await response.json();
      //await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(placesActions.setFocused(null));
      dispatch(fetchPlaces(""));
    } catch (error) {
      console.log(error);
    }
  };
};
