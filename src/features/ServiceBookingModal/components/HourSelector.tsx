import { serviceBookingActions } from "store/service-slice";
import { Option, Row } from "./Row";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import {
  getDateString,
  getLocalDate,
  getLocalTime,
  getTime,
} from "utils/dateTime";
import { DateTime } from "luxon";

interface HourProps {
  hour: string;
  isNow: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const Hour = ({ hour, isNow, isSelected, isDisabled, onClick }: HourProps) => {
  const textColor = isNow && !isSelected ? "!text-blue-600" : "";
  return (
    <Option
      onClick={onClick}
      isSelected={isSelected}
      isDisabled={isDisabled}
      className="h-8 w-14"
    >
      <span className={`${textColor} text-sm`}>{hour}</span>
    </Option>
  );
};

const HourSelector = () => {
  const freeSlots = useAppSelector((state) => state.book.freeSlots);
  const selectedDate = useAppSelector((state) => state.book.selectedDate);
  const selectedTime = useAppSelector((state) => state.book.selectedTime);
  const dispatch = useAppDispatch();

  const availableHours = freeSlots
    .map((slot) => DateTime.fromISO(slot))
    .reduce((acc: string[], curr) => {
      const date = getLocalDate(curr);
      if (date !== selectedDate) return acc;
      const time = getLocalTime(curr);
      if (!acc.find((item) => item === time)) acc.push(time);
      return acc;
    }, []);

  const getOnHourClickHandler = (hour: string) => () =>
    dispatch(serviceBookingActions.setTime(hour));

  return (
    <>
      {availableHours?.length > 0 && (
        <Row>
          {availableHours.map((hour) => (
            <Hour
              key={`${hour}`}
              hour={hour}
              isNow={false}
              isSelected={selectedTime === hour}
              isDisabled={false}
              onClick={getOnHourClickHandler(hour)}
            />
          ))}
        </Row>
      )}
      {availableHours?.length === 0 && (
        <div className="my-4 mx-8 font-semibold text-gray-400">
          Please select a date to continue
        </div>
      )}
    </>
  );
};

export default HourSelector;
