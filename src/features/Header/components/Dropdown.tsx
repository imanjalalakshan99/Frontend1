import UserAvatar from "components/UserAvatar";
import { useAppSelector } from "hooks/redux-hooks";
import { useState } from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  onClick?: () => void;
  text: string;
  Icon: IconType;
}

export const DropdownButton = ({ onClick, text, Icon }: ButtonProps) => {
  const onClickHandler = () => onClick && onClick();
  return (
    <li
      onClick={onClickHandler}
      className="text-sm font-semibold text-gray-700"
    >
      <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
        <Icon className="mr-4 h-5 w-5" />
        {text}
      </a>
    </li>
  );
};

interface Props {
  children: React.ReactNode;
}

const Dropdown = ({ children }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  return (
    <div className="relative">
      <button
        className={`${
          isOpen ? "ring-4 ring-gray-100" : ""
        } flex items-center rounded-full text-sm font-medium text-white`}
        onClick={toggle}
      >
        <UserAvatar
          name={user?.name || ""}
          image={user?.profileImage}
          className="h-8 w-8 bg-pink-600 !text-base xs:mr-2"
        />
        <div className="hidden items-center xs:flex">
          {user?.name}
          <svg
            className="mx-1.5 h-4 w-4"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </button>
      <div
        className={`${
          isOpen ? "" : "hidden"
        } absolute right-0 z-10 mt-2 w-60 divide-y divide-gray-100 rounded-lg border bg-white shadow`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
