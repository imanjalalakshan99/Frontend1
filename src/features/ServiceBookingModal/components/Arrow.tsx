import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
}

const Arrow = ({ direction, onClick, className }: Props) => {
  const Icon = direction === "left" ? FaChevronLeft : FaChevronRight;
  return (
    <div
      className={`flex h-full w-14 cursor-pointer items-center justify-center ${className}`}
      onClick={onClick}
    >
      <Icon className="text-gray-500" />
    </div>
  );
};

export default Arrow;
