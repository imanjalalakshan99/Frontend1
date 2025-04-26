import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { Option, Row } from "./Row";
import {
  getDateString,
  getDay,
  getDayName,
  getLocalDate,
} from "utils/dateTime";
import { serviceBookingActions } from "store/service-slice";
import isToday from "utils/isToday";
import { DateTime } from "luxon";

interface DayProps {
  day: number;
  dayName: string;
  isNow: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const Day = ({
  day,
  dayName,
  isNow,
  isSelected,
  isDisabled,
  onClick,
}: DayProps) => {
  const textColor = isNow && !isSelected ? "!text-blue-600" : "";
  return (
    <Option
      onClick={onClick}
      isSelected={isSelected}
      isDisabled={isDisabled}
      className="h-[4.5rem] w-14"
    >
      <span className={`${textColor} text-sm`}>{dayName}</span>
      <span className={`${textColor} mt-0.5`}>{day}</span>
    </Option>
  );
};

const DaySelector = () => {
  const freeSlots = useAppSelector((state) => state.book.freeSlots);
  const selectedDate = useAppSelector((state) => state.book.selectedDate);

  const dispatch = useAppDispatch();

  const distinctDates = freeSlots
    .map((slot) => DateTime.fromISO(slot))
    .reduce((acc: string[], curr) => {
      const date = getLocalDate(curr);
      if (!acc.find((item) => item === date)) acc.push(date);
      return acc;
    }, [] as string[]);

  const getOnDateClickHandler = (date: string) => () =>
    dispatch(serviceBookingActions.setDate(date));

  return (
    <Row>
      {distinctDates.map((date) => {
        const day = getDay(`${date}T00:00:00.000Z`);
        const dayName = getDayName(`${date}T00:00:00.000Z`);
        return (
          <Day
            key={`${date}`}
            day={day}
            dayName={dayName}
            isNow={isToday(date)}
            isSelected={selectedDate === date}
            isDisabled={false}
            onClick={getOnDateClickHandler(date)}
          />
        );
      })}
    </Row>
  );
};

export default DaySelector;
