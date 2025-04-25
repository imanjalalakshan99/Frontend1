import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IFreeSlot } from "types/IFreeSlot";
import { getDateString, getTime } from "utils/dateTime";

interface ServiceBookingState {
  modalOpen: boolean;
  freeSlots: IFreeSlot[];
  selectedDate?: string;
  selectedTime?: string;
  placeId?: string;
  serviceId?: string;
  loading: boolean;
  message?: string;
  errorMessage?: string;
  isEditing: boolean;
  editId?: string;
  additionalDate?: string;
}

const initialState: ServiceBookingState = {
  modalOpen: false,
  freeSlots: [],
  selectedDate: undefined,
  selectedTime: undefined,
  placeId: undefined,
  serviceId: undefined,
  loading: false,
  message: undefined,
  errorMessage: undefined,
  isEditing: false,
  additionalDate: undefined,
  editId: undefined,
};

const serviceBookingSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    showBookingModal(
      state,
      action: PayloadAction<{
        slots: IFreeSlot[];
        placeId: string;
        serviceId: string;
      }>
    ) {
      state.modalOpen = true;
      state.freeSlots = action.payload.slots;
      state.placeId = action.payload.placeId;
      state.serviceId = action.payload.serviceId;
      state.errorMessage = undefined;
      state.message = undefined;
      state.loading = false;
      state.isEditing = false;
      state.additionalDate = undefined;
      state.editId = undefined;
    },
    showEditingModal(
      state,
      action: PayloadAction<{
        editId: string;
        slots: IFreeSlot[];
        placeId: string;
        serviceId: string;
        additionalDate: string;
      }>
    ) {
      state.editId = action.payload.editId;
      state.modalOpen = true;
      state.freeSlots = action.payload.slots;
      state.placeId = action.payload.placeId;
      state.serviceId = action.payload.serviceId;
      state.errorMessage = undefined;
      state.message = undefined;
      state.loading = false;
      state.isEditing = true;
      state.additionalDate = action.payload.additionalDate;
      state.selectedDate = getDateString(action.payload.additionalDate);
      state.selectedTime = getTime(action.payload.additionalDate);
    },
    setDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
      state.selectedTime = undefined;
    },
    setTime(state, action: PayloadAction<string>) {
      state.selectedTime = action.payload;
    },
    hideModal(state) {
      state.modalOpen = false;
      state.freeSlots = [];
      state.selectedDate = undefined;
      state.selectedTime = undefined;
      state.placeId = undefined;
      state.serviceId = undefined;
      state.isEditing = false;
      state.additionalDate = undefined;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMessage(state, action: PayloadAction<string | undefined>) {
      state.message = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string | undefined>) {
      state.errorMessage = action.payload;
    },
  },
});

export const serviceBookingActions = serviceBookingSlice.actions;
export default serviceBookingSlice.reducer;
