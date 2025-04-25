import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { getMonth, getMonthName } from "utils/dateTime";
import DaySelector from "./DaySelector";
import HourSelector from "./HourSelector";

const Calendar = () => {
  const freeSlots = useAppSelector((state) => state.book.freeSlots);
  const dispatch = useAppDispatch();

  const distinctYears: string[] = freeSlots.reduce((acc: string[], curr) => {
    const year = curr.split("-")[0];
    if (!acc.find((item) => item === year)) acc.push(year);
    return acc;
  }, []);

  const monthsString = freeSlots
    .reduce((acc: string[], curr) => {
      const month =
        getMonthName(getMonth(curr)) +
        (distinctYears.length > 1 ? ` ${curr.split("-")[0]} ` : " ");
      if (!acc.find((item) => item === month)) acc.push(month);
      return acc;
    }, [])
    .join(" - ");

  return (
    <div className="mt-4">
      <h1 className="flex w-full justify-center text-2xl font-bold text-gray-800 ">
        {monthsString} {distinctYears.length === 1 && distinctYears[0]}
      </h1>
      <DaySelector />
      <div className="mt-4 w-full border-b"></div>
      <HourSelector />
      <div className="mt-4 w-full border-b"></div>
    </div>
  );
};

export default Calendar;
