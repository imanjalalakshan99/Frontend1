import fetchApi from "utils/fetchApi";
import { AppThunk } from ".";
import { reservationsActions } from "./reservations-slice";
import { IReservation } from "types/IReservation";

export const fetchReservations = (): AppThunk => {
  return async (dispatch, getState) => {
    const fetchData = async () => {
      const response = await fetchApi("/api/reservation", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Could not fetch reservations!");
      }
      const data = await response.json();
      return data;
    };
    try {
      const reservationsData = (await fetchData()) as IReservation[];
      console.log(reservationsData);
      dispatch(reservationsActions.setReservations(reservationsData));
    } catch (error) {
      dispatch(reservationsActions.setReservations([]));
    }
  };
};

export const cancelReservation = (id: string): AppThunk => {
  return async (dispatch, getState) => {
    const fetchData = async () => {
      const response = await fetchApi(`/api/reservation/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Could not cancel reservation!");
      }
      const data = await response.json();
      return data;
    };
    try {
      await fetchData();
      dispatch(reservationsActions.setSelected(undefined));
      dispatch(fetchReservations());
    } catch (error) {
      console.log(error);
    }
  };
};
