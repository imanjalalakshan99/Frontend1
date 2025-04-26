import { IFreeSlotsDTO } from "../dtos/FreeSlotsDTO";
import { IReservation } from "../models/IReservation";
import { IOpeningHours } from "../models/OpeningHours";
import { DateTime } from "luxon";

interface ISlot {
  start: DateTime;
  end: DateTime;
}

const getSlots = (
  start: DateTime,
  stop: DateTime,
  duration: number
): ISlot[] => {
  const slots: ISlot[] = [];
  let a = start;
  let b = start.plus({ minutes: duration });
  while (b <= stop) {
    slots.push({ start: a, end: b });
    a = a.plus({ minutes: 15 });
    b = b.plus({ minutes: 15 });
  }
  return slots;
};

const getTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
const getDateString = (date: DateTime): string => {
  const year = date.year.toString();
  const month = date.month.toString().padStart(2, "0");
  const day = date.day.toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getHour = (hourISOString: string): number =>
  parseInt(hourISOString.slice(0, 2));
const getMinutes = (hourISOString: string): number =>
  parseInt(hourISOString.slice(3, 5));

export const getFreeSlots = (
  openingHours: IOpeningHours[],
  reservations: IReservation[],
  duration: number
): string[] => {
  const now = DateTime.now().setZone("Europe/Warsaw");
  let date = now;
  const freeSlots: string[] = [];
  [...Array(14).keys()].forEach((i) => {
    const openingHour = openingHours.find(
      (openingHour) => openingHour.dayOfWeek === date.weekday
    );
    if (openingHour) {
      const opening = date.set({
        hour: getHour(openingHour.from),
        minute: getMinutes(openingHour.from),
        second: 0,
        millisecond: 0,
      });
      const closing = date.set({
        hour: getHour(openingHour.to),
        minute: getMinutes(openingHour.to),
        second: 0,
        millisecond: 0,
      });
      const allSlots = getSlots(opening, closing, duration);
      allSlots.forEach((slot) => {
        const isFree = reservations.every((reservation) => {
          const rt = reservation.serviceReservation?.reservationTime;
          if (!rt) return true;
          return (
            slot.start.toMillis() >= rt.to.getTime() ||
            slot.end.toMillis() <= rt.from.getTime()
          );
        });
        if (isFree && slot.start > now) {
          freeSlots.push(slot.start.toJSDate().toISOString());
        }
      });
    }
    date = date.plus({ days: 1 });
  });
  return freeSlots;
};
