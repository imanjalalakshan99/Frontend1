import Logo from "components/Logo";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

const NavBar = ({ children }: Props) => {
  return (
    <nav className="bg-green-600 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
        
        {/* Logo and Site Name */}
        <Link to="/" reloadDocument className="flex items-center space-x-3 text-white">
          <Logo className="h-10 w-10" />
          <span className="text-2xl font-bold tracking-wide hover:text-green-100 transition">
            TravelWithMe
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-white text-lg">
          {children}
        </div>

        {/* Sign In Button */}
        <div className="flex items-center">
          <Link to="/signin">
            <button className="bg-white text-green-600 font-semibold px-5 py-2 rounded-full hover:bg-green-100 hover:text-green-700 transition">
              Sign In
            </button>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
