import { useState } from "react";
import IOpeningHours from "types/IOpeningHours";
import { days, getTime, isTimeGreater } from "utils/dateTime";

interface SelectorProps {
  value: string;
  onChange: (value: string) => void;
  valid: boolean;
}

const Selector = ({ value, onChange, valid }: SelectorProps) => {
  const time = new Date("1970-01-01T00:00:00.000Z");
  const times = [...Array(4 * 24)].map((_, i) => {
    const current = getTime(time.toISOString());
    time.setMinutes(time.getMinutes() + 15);
    return current;
  });
  const onChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };
  return (
    <select
      value={value}
      onChange={onChangeHandler}
      className={`rounded border ${!valid && "border-red-600"}`}
    >
      <option value="--:--" key={"closed"}>
        Closed
      </option>
      {times.map((current) => {
        return (
          <option value={current} key={current}>
            {current}
          </option>
        );
      })}
    </select>
  );
};

interface Props {
  value: IOpeningHours;
  onChange: (value: IOpeningHours) => void;
}

const TimeSelector = ({ value, onChange }: Props) => {
  const { dayOfWeek, from, to } = value;
  const valid = (from == "--:--" && to === "--:--") || isTimeGreater(to, from);
  const day = days[value.dayOfWeek];
  const setFrom = (value: string) => {
    if (value === "--:--") {
      onChange({ dayOfWeek, to: value, from: value });
    } else
      onChange({ dayOfWeek, to: to !== "--:--" ? to : "17:00", from: value });
  };
  const setTo = (value: string) => {
    if (value === "--:--") {
      onChange({ dayOfWeek, to: value, from: value });
    } else
      onChange({
        dayOfWeek,
        from: from !== "--:--" ? from : "09:00",
        to: value,
      });
  };
  return (
    <div className={`flex items-center ${dayOfWeek === 0 && "order-last"}`}>
      <span className="w-1/4">{day}</span>
      <div className="flex w-3/4">
        <Selector value={from} onChange={setFrom} valid={valid} />
        <span className="mx-2">to</span>
        <Selector value={to} onChange={setTo} valid={valid} />
      </div>
    </div>
  );
};

export default TimeSelector;
