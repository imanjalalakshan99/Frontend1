import { useRef } from "react";
import Arrow from "./Arrow";

interface OptionProps {
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Option = ({
  isSelected,
  isDisabled,
  onClick,
  children,
  className,
}: OptionProps) => {
  const textColor = isSelected ? "text-white" : "text-gray-500";
  const bgColor = isSelected ? "bg-blue-500" : "bg-white";
  const onClickHandler = () => {
    if (isDisabled) return;
    onClick();
  };
  return (
    <div
      className={`${className} ${bgColor} relative flex flex-shrink-0 flex-grow-0 cursor-pointer items-center justify-center rounded-xl border `}
      onClick={onClickHandler}
    >
      <div
        className={`${textColor} z-0 flex flex-col items-center justify-center font-semibold`}
      >
        {children}
      </div>
      {isDisabled && (
        <div className="absolute z-10 h-full w-full !cursor-not-allowed rounded-xl bg-[#0000000a]"></div>
      )}
    </div>
  );
};

interface RowProps {
  children: React.ReactNode;
}

export const Row = ({ children }: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const clickHandler = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollTo =
      direction === "left"
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;
    rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
  };

  return (
    <div className="mt-4 flex items-center">
      <Arrow
        direction="left"
        onClick={() => clickHandler("left")}
        className="flex-shrink-0 flex-grow-0"
      />
      <div
        className="no-scrollbar flex flex-1 gap-4 overflow-x-auto"
        ref={rowRef}
      >
        {children}
      </div>
      <Arrow
        direction="right"
        onClick={() => clickHandler("right")}
        className="flex-shrink-0 flex-grow-0"
      />
    </div>
  );
};
