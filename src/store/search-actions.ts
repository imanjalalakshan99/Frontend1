import { AppThunk } from ".";
import { fetchPlaces } from "./places-actions";
import { placesActions } from "./places-slice";

export const search = (): AppThunk => {
  return async (dispatch, getState) => {
    const searchState = getState().search;
    const searchQuery = searchState.search;
    const priceFrom =
      searchState.priceFrom.length > 0 ? searchState.priceFrom : undefined;
    const priceTo =
      searchState.priceTo.length > 0 ? searchState.priceTo : undefined;
    const type = searchState.type.length > 0 ? searchState.type : undefined;
    dispatch(fetchPlaces(searchQuery, priceFrom, priceTo, type));
    dispatch(placesActions.setFocused(null));
  };
};
