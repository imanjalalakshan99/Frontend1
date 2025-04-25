import Logo from "components/Logo";
import React, { Children } from "react";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

const NavBar = ({ children }: Props) => {
  return (
    <nav className="z-20 flex-shrink-0 flex-grow-0 bg-blue-700 px-2.5 py-2.5 text-white sm:px-4">
      <div className="mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" reloadDocument>
          <div className="flex cursor-pointer items-center whitespace-nowrap text-xl font-semibold">
            <Logo className="h-8 w-8 py-1" />
          </div>
        </Link>
        <ul className="flex items-center space-x-4 rounded-lg bg-blue-700 xs:space-x-6">
          {children}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
