import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IFreeRoomSlot, IFreeSlot } from "types/IFreeSlot";
import { getDateString, getTime } from "utils/dateTime";

interface RoomBookingState {
  modalOpen: boolean;
  freeSlots: IFreeRoomSlot[];
  availableDays: IFreeSlot[];
  selectedStartDate?: string;
  selectedEndDate?: string;
  placeId?: string;
  roomId?: string;
  loading: boolean;
  message?: string;
  errorMessage?: string;
  isEditing: boolean;
  editId?: string;
}

const initialState: RoomBookingState = {
  modalOpen: false,
  freeSlots: [],
  availableDays: [],
  selectedStartDate: undefined,
  selectedEndDate: undefined,
  placeId: undefined,
  roomId: undefined,
  loading: false,
  message: undefined,
  errorMessage: undefined,
  isEditing: false,
  editId: undefined,
};

const roomBookingSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    showBookingModal(
      state,
      action: PayloadAction<{
        slots: IFreeRoomSlot[];
        placeId: string;
        roomId: string;
      }>
    ) {
      state.modalOpen = true;
      state.freeSlots = action.payload.slots;
      state.placeId = action.payload.placeId;
      state.roomId = action.payload.roomId;
      state.errorMessage = undefined;
      state.message = undefined;
      state.loading = false;
      state.isEditing = false;
      state.editId = undefined;
      const slots = action.payload.slots;
      const days = slots.map((slot) => slot.start);
      state.availableDays = days;
    },
    showEditingModal(
      state,
      action: PayloadAction<{
        editId: string;
        slots: IFreeRoomSlot[];
        placeId: string;
        roomId: string;
        startDate: string;
        endDate: string;
      }>
    ) {
      state.editId = action.payload.editId;
      state.modalOpen = true;
      state.freeSlots = action.payload.slots;
      state.placeId = action.payload.placeId;
      state.roomId = action.payload.roomId;
      state.errorMessage = undefined;
      state.message = undefined;
      state.loading = false;
      state.isEditing = true;
      state.selectedStartDate = action.payload.startDate;
      state.selectedEndDate = action.payload.endDate;
      const slots = action.payload.slots;
      let days = slots.map((slot) => slot.start);
      slots.forEach((slot) => {
        if (days.includes(slot.end)) return;
        days.push(slot.end);
      });
      days = days.filter((day) => day >= action.payload.startDate);
      days = days.filter((day) => day <= action.payload.endDate);
      state.availableDays = days;
    },
    setStartingDate(state, action: PayloadAction<string | undefined>) {
      state.selectedStartDate = action.payload;
    },
    setEndingDate(state, action: PayloadAction<string | undefined>) {
      state.selectedEndDate = action.payload;
    },
    setAvailableDays(state, action: PayloadAction<IFreeSlot[]>) {
      state.availableDays = action.payload;
    },
    hideModal(state) {
      state.modalOpen = false;
      state.freeSlots = [];
      state.selectedStartDate = undefined;
      state.selectedEndDate = undefined;
      state.availableDays = [];
      state.placeId = undefined;
      state.roomId = undefined;
      state.isEditing = false;
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

export const roomBookingActions = roomBookingSlice.actions;
export default roomBookingSlice.reducer;
