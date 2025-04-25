import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IPlace from "types/IPlace";

interface BusinessState {
  modalOpen: boolean;
  editing: boolean;
  subject: IPlace | undefined;
  loading: boolean;
}

const initialState: BusinessState = {
  modalOpen: false,
  loading: false,
  editing: false,
  subject: undefined,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    showModal(state) {
      state.modalOpen = true;
      state.loading = false;
      state.editing = false;
      state.subject = undefined;
    },
    hideModal(state) {
      state.modalOpen = false;
      state.loading = false;
      state.editing = false;
      state.subject = undefined;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setEditing(state, action: PayloadAction<IPlace>) {
      state.modalOpen = true;
      state.loading = false;
      state.editing = true;
      state.subject = action.payload;
    },
  },
});

export const businessActions = businessSlice.actions;
export default businessSlice.reducer;
