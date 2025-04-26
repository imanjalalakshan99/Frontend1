import { DateTime } from "luxon";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const getMonthName = (month: number): string => months[month - 1];
export const getMonthNameShort = (month: number): string =>
  months[month - 1].slice(0, 3);
export const getDayName = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString("en-US", { weekday: "short" });
};
export const getMonth = (date: string): number => parseInt(date.slice(5, 7));
export const getDay = (date: string): number => parseInt(date.slice(8, 10));
export const getDateString = (date: string): string => date.slice(0, 10);
export const getLocalDate = (date: DateTime): string => {
  const year = date.year.toString();
  const month = date.month.toString().padStart(2, "0");
  const day = date.day.toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const getLocalTime = (date: DateTime): string => {
  const hours = date.hour.toString().padStart(2, "0");
  const minutes = date.minute.toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
export const getTime = (date: string): string => date.slice(11, 16);
export const areDatesEqual = (date1: string, date2: string): boolean => {
  return getDateString(date1) === getDateString(date2);
};
export const isTimeGreater = (time1: string, time2: string): boolean => {
  const date1 = new Date(`2020-01-01T${time1}`);
  const date2 = new Date(`2020-01-01T${time2}`);
  return date1 > date2;
};
