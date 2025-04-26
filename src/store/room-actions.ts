import { AppThunk } from "store";
import { IFreeRoomSlot, IFreeSlot } from "types/IFreeSlot";
import fetchApi from "utils/fetchApi";
import { fetchReservations } from "./reservations-actions";
import { isLoggedIn } from "utils/auth";
import { authActions } from "./auth-slice";
import { DateTime } from "luxon";
import { roomBookingActions } from "./room-slice";

export const onDateClick = (date?: DateTime): AppThunk => {
  return async (dispatch, getState) => {
    const {
      room: { selectedStartDate, selectedEndDate, freeSlots },
    } = getState();
    if (!date || (selectedStartDate && selectedEndDate)) {
      dispatch(roomBookingActions.setStartingDate(undefined));
      dispatch(roomBookingActions.setEndingDate(undefined));
      const days = freeSlots.map((slot) => slot.start);
      dispatch(roomBookingActions.setAvailableDays(days));
      return;
    }
    if (selectedStartDate) {
      const startDate = DateTime.fromISO(selectedStartDate);
      if (startDate.equals(date)) {
        dispatch(roomBookingActions.setStartingDate(undefined));
      } else if (startDate.toMillis() < date.toMillis()) {
        const dateStr = date.toJSDate().toISOString();
        let days = getState().room.availableDays;
        days = days.filter((day) => day <= dateStr);
        dispatch(roomBookingActions.setAvailableDays(days));
        dispatch(
          roomBookingActions.setEndingDate(date.toJSDate().toISOString())
        );
      } else {
        dispatch(
          roomBookingActions.setStartingDate(date.toJSDate().toISOString())
        );
      }
    } else {
      const dateStr = date.toJSDate().toISOString();
      dispatch(roomBookingActions.setStartingDate(dateStr));
      let days = freeSlots.map((slot) => slot.end);
      days = days.filter((day) => day > dateStr);
      let tempDate = date.plus({ days: 1 });
      while (
        freeSlots.find((slot) => slot.end === tempDate.toJSDate().toISOString())
      ) {
        tempDate = tempDate.plus({ days: 1 });
      }
      days = days.filter((day) => day <= tempDate.toJSDate().toISOString());
      dispatch(roomBookingActions.setAvailableDays(days));
    }
  };
};

export const showRoomBookingModal = (
  placeId: string,
  roomId: string
): AppThunk => {
  return async (dispatch, getState) => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("roomId", roomId);
      searchParams.append("placeId", placeId);
      const response = await fetchApi(
        `/api/reservation/available/rooms?${searchParams}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Could not fetch service data!");
      }
      const data = await response.json();
      return data;
    };
    try {
      const slots = (await fetchData()) as IFreeRoomSlot[];
      slots.sort((a, b) => a.start.localeCompare(b.start));
      console.log(slots);
      dispatch(
        roomBookingActions.showBookingModal({
          slots,
          placeId,
          roomId,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const showRoomEditingModal = (
  id: string,
  placeId: string,
  roomId: string,
  reservationId: string,
  startDate: IFreeSlot,
  endDate: IFreeSlot
): AppThunk => {
  return async (dispatch, getState) => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("roomId", roomId);
      searchParams.append("placeId", placeId);
      searchParams.append("reservationId", reservationId);
      const response = await fetchApi(
        `/api/reservation/available/rooms?${searchParams}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Could not fetch service data!");
      }
      const data = await response.json();
      return data;
    };
    if (!isLoggedIn()) {
      dispatch(authActions.showModal());
      return;
    }
    try {
      const slots = (await fetchData()) as IFreeRoomSlot[];
      dispatch(
        roomBookingActions.showEditingModal({
          editId: id,
          slots,
          placeId,
          roomId,
          startDate,
          endDate,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const sendRoomBookingRequest = (): AppThunk => {
  return async (dispatch, getState) => {
    if (!isLoggedIn()) {
      dispatch(roomBookingActions.hideModal());
      dispatch(authActions.showModal());
      return;
    }
    try {
      dispatch(roomBookingActions.setLoading(true));
      const isEditing = getState().room.isEditing;
      const {
        room: { selectedStartDate, selectedEndDate, placeId, roomId },
      } = getState();
      if (!selectedStartDate || !selectedEndDate || !placeId || !roomId) {
        throw new Error("Please fill the form again.");
      }
      const method = isEditing ? "PUT" : "POST";
      const path = isEditing
        ? `/api/reservation/room/${getState().room.editId}`
        : "/api/reservation/room";

      const startDate = DateTime.fromISO(`${selectedStartDate}`, {
        zone: "local",
      })
        .setZone("utc+0")
        .toISO();
      const endDate = DateTime.fromISO(`${selectedEndDate}`, {
        zone: "local",
      })
        .setZone("utc+0")
        .toISO();
      const response = await fetchApi(path, {
        method,
        body: JSON.stringify({
          placeId,
          roomId,
          startDate,
          endDate,
        }),
      });
      if (!response.ok) {
        if (response.body) {
          const data = await response.json();
          if (data.message) {
            throw new Error(data.message);
          }
        }
        throw new Error(
          "Booking failed: The selected time slot is no longer available. Please choose another time slot."
        );
      }
      dispatch(roomBookingActions.setMessage("Booking successful!"));
      dispatch(roomBookingActions.setErrorMessage(undefined));
      dispatch(fetchReservations());
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(roomBookingActions.hideModal());
    } catch (error: any) {
      console.log(error);
      dispatch(
        roomBookingActions.setErrorMessage(
          typeof error.message === "string"
            ? error.message
            : "There was a problem, please try again later!"
        )
      );
      dispatch(roomBookingActions.setMessage(undefined));
    }
    dispatch(roomBookingActions.setLoading(false));
  };
};
