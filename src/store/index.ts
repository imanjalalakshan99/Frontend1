import { AnyAction, ThunkAction, configureStore } from "@reduxjs/toolkit";

import placesReducer from "./places-slice";
import serviceBookingSlice from "./service-slice";
import authSlice from "./auth-slice";
import reservationsSlice from "./reservations-slice";
import businessSlice from "./business-slice";
import searchSlice from "./search-slice";
import roomBookingSlice from "./room-slice";

const store = configureStore({
  reducer: {
    places: placesReducer,
    book: serviceBookingSlice,
    auth: authSlice,
    reservations: reservationsSlice,
    business: businessSlice,
    search: searchSlice,
    room: roomBookingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, AnyAction>;
export default store;
