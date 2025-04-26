import { IoMdArrowRoundBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface Props {
  text?: string;
  onBack: () => void;
}

const NaviButtons = ({ onBack, text }: Props) => {
  if (text)
    return (
      <button
        onClick={onBack}
        className="flex items-center gap-2 p-2 font-bold text-gray-500 hover:text-gray-800"
      >
        <IoMdArrowRoundBack className="h-7 w-7 " />
        {text}
      </button>
    );
  return (
    <div>
      <button
        onClick={onBack}
        className="m-2 flex items-center rounded-full border bg-white  p-0.5 font-bold text-gray-500 shadow-xl hover:text-gray-800"
      >
        <IoClose className="h-7 w-7 text-gray-600" />
      </button>
    </div>
  );
};

export default NaviButtons;
