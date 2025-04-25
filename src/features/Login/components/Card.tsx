import Logo from "components/Logo";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  text: string;
  onClose: () => void;
}

const Card = ({ children, text, onClose }: Props) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col space-y-4 bg-white p-6 text-gray-600 shadow-2xl xs:relative xs:h-fit xs:w-fit xs:min-w-[320px] xs:rounded">
      <div className="flex justify-between">
        <Link to="/">
          <Logo className="h-10 w-10" fill="#4b5563" />
        </Link>
        <IoClose
          className="h-10 w-10 cursor-pointer xs:hidden"
          onClick={onClose}
        />
      </div>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800">
        {text}
      </h1>
      {children}
    </div>
  );
};

export default Card;
