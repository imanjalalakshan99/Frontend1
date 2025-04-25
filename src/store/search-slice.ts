import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SearchState {
  search: string;
  type: string;
  priceFrom: string;
  priceTo: string;
}

const initialState: SearchState = {
  search: "",
  type: "",
  priceFrom: "",
  priceTo: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setType(state, action: PayloadAction<string>) {
      state.type = action.payload;
    },
    setPriceFrom(state, action: PayloadAction<string>) {
      state.priceFrom = action.payload;
    },
    setPriceTo(state, action: PayloadAction<string>) {
      state.priceTo = action.payload;
    },
    clear(state) {
      state.search = "";
      state.type = "";
      state.priceFrom = "";
      state.priceTo = "";
    },
  },
});

export const searchActions = searchSlice.actions;
export default searchSlice.reducer;
