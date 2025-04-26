import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlace } from "../types/IPlace";
import { IReview } from "../types/IReview";

export interface PlacesState {
  places: IPlace[];
  focused: IPlace | null;
  firstLoading?: boolean;
}

const initialState: PlacesState = {
  places: [],
  focused: null,
};

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    setPlaces(state, action: PayloadAction<IPlace[]>) {
      state.places = action.payload;
      if (state.focused) {
        if (!state.places.find((place) => place.id === state.focused?.id)) {
          state.places.push(state.focused);
        }
      }
    },
    setFocused(state, action: PayloadAction<IPlace | null>) {
      if (!action.payload) {
        state.focused = null;
        return;
      }
      state.focused = action.payload;

      const id = action.payload.id;
      const place = state.places.find((place) => place.id === id);
      if (!place) {
        state.places.push(action.payload);
      }
    },
    addPlace(state, action: PayloadAction<IPlace>) {
      const id = action.payload.id;
      const place = state.places.find((place) => place.id === id);
      if (place) {
        state.places.splice(state.places.indexOf(place), 1);
      }
      state.places.push(action.payload);
    },
    addReview(
      state,
      action: PayloadAction<{ placeId: string; review: IReview }>
    ) {
      const place = state.places.find(
        (place) => place.id === action.payload.placeId
      );
      if (!place) return;
      place.reviews = place.reviews.filter(
        (review) => review.user.id !== action.payload.review.user.id
      );
      if (state.focused?.id === action.payload.placeId) {
        state.focused = place;
      }
      place.reviews.push(action.payload.review);
    },
    removeReview(
      state,
      action: PayloadAction<{ placeId: string; userId: string }>
    ) {
      const place = state.places.find(
        (place) => place.id === action.payload.placeId
      );
      if (!place) return;
      place.reviews = place.reviews.filter(
        (review) => review.user.id !== action.payload.userId
      );
      if (state.focused?.id === action.payload.placeId) {
        state.focused = place;
      }
      console.log("reviews", place.reviews);
    },
  },
});

export const placesActions = placesSlice.actions;
export default placesSlice.reducer;
