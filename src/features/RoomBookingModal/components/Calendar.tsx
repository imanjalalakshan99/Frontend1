import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { onDateClick } from "store/room-actions";
import { roomBookingActions } from "store/room-slice";
import { days } from "utils/dateTime";

interface DullItemProps {
  text?: React.ReactNode | string | number;
}
const DullItem = ({ text }: DullItemProps) => {
  return (
    <div className="z-30 flex h-10 w-10 flex-none items-center justify-center overflow-hidden text-gray-400">
      {text}
    </div>
  );
};

interface ItemProps {
  date: DateTime;
}
const Item = ({ date }: ItemProps) => {
  const freeSlots = useAppSelector((state) => state.room.freeSlots);
  const availableDays = useAppSelector((state) => state.room.availableDays);
  const selectedStartDate = useAppSelector(
    (state) => state.room.selectedStartDate
  );
  const selectedEndDate = useAppSelector((state) => state.room.selectedEndDate);
  const dispatch = useAppDispatch();
  const { isStart, isEnd, isBetween, isDisabled } = useMemo(() => {
    const dateMillis = date.toMillis();
    const startMillis = selectedStartDate
      ? DateTime.fromISO(selectedStartDate).toMillis()
      : undefined;
    const endMillis = selectedEndDate
      ? DateTime.fromISO(selectedEndDate).toMillis()
      : undefined;
    const isStart = startMillis === dateMillis;
    const isEnd = endMillis === dateMillis;
    const isBetween =
      startMillis && endMillis
        ? startMillis < dateMillis && dateMillis < endMillis
        : false;
    const dateISOString = date.toJSDate().toISOString();

    const isDisabled = !availableDays.find((item) => item === dateISOString);

    return { isStart, isEnd, isBetween, isDisabled };
  }, [date, freeSlots, selectedEndDate, selectedStartDate]);

  const onClickHandler = () => {
    if (isDisabled) {
      dispatch(onDateClick());
      return;
    }
    dispatch(onDateClick(date));
  };
  const day = date.day;
  return (
    <div className="relative h-fit w-fit">
      {isBetween && (
        <div className="absolute top-0 bottom-0 -left-1 -right-1 z-0 bg-gray-200"></div>
      )}
      <button
        className={
          "relative z-30 flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-md font-semibold " +
          (!isDisabled ? "cursor-pointer " : "") +
          (isStart || isEnd ? "bg-blue-600 text-white " : "") +
          (isDisabled ? "text-gray-400 " : "text-black ")
        }
        onClick={onClickHandler}
      >
        {day}
      </button>
      {isStart && selectedEndDate && (
        <>
          <div className="absolute top-0 bottom-0 left-0 -right-1 z-10 bg-gray-200"></div>
          <div className="absolute top-0 bottom-0 left-1/2 right-0 z-20 bg-blue-600"></div>
        </>
      )}
      {isEnd && (
        <>
          <div className="absolute top-0 bottom-0 right-0 -left-1 z-10 bg-gray-200"></div>
          <div className="absolute top-0 bottom-0 right-1/2 left-0 z-20 bg-blue-600"></div>
        </>
      )}
    </div>
  );
};

interface MonthProps {
  month: string;
  days: DateTime[];
}
const Month = ({ month, days }: MonthProps) => {
  if (!days || days.length === 0) return null;

  const firstDayModulo = ((days[0].day - 1) % 7) + 1;
  const firstDayWeek = days[0].weekday;
  const offset = (firstDayWeek - firstDayModulo + 7) % 7;
  const daysInMonth = Number(days[0].daysInMonth);

  const firstDayOfMonth = days[0].set({ day: 1 });

  const getOption = (dayOfMonth: number) => {
    const date = firstDayOfMonth.set({ day: dayOfMonth });
    return <Item key={date.toISODate()} date={date} />;
  };

  return (
    <>
      <div className="flex justify-between px-2">
        <span className="font-bold text-gray-800">{month}</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, index) => (
          <DullItem key={index + "dull"} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) =>
          getOption(index + 1)
        )}
      </div>
    </>
  );
};

const Calendar = () => {
  const freeSlots = useAppSelector((state) => state.room.freeSlots);

  const { dates, months } = useMemo(() => {
    const dates = freeSlots
      .map((item) => DateTime.fromISO(item.start).setLocale("en-GB"))
      .sort();
    const months = dates.reduce((acc: string[], curr) => {
      const month = curr.monthLong + "";
      if (!acc.find((item) => item === month)) acc.push(month);
      return acc;
    }, []);
    return { dates, months };
  }, [freeSlots]);

  return (
    <div className="flex justify-center">
      <div className="w-fit rounded-lg px-4">
        <div className="flex gap-1 border-b">
          <DullItem text={"Md"} />
          <DullItem text={"Tu"} />
          <DullItem text={"Wd"} />
          <DullItem text={"Th"} />
          <DullItem text={"Fr"} />
          <DullItem text={"Sa"} />
          <DullItem text={"Su"} />
        </div>
        <div className="flex h-80 flex-col gap-1 overflow-y-auto overflow-x-hidden py-1">
          {months.map((month, index) => (
            <Month
              key={index + month}
              month={month}
              days={dates.filter((date) => date.monthLong === month)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
