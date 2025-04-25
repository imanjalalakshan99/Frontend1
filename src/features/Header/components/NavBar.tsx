import React from "react";
import { Link } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

const NavBar = ({ children }: Props) => {
  return (
    <nav className="bg-green-300 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between py-5 px-6">
        
        {/* Site Name */}
        <Link to="/" reloadDocument className="flex items-center space-x-3 text-green-900">
          <span className="text-4xl font-extrabold tracking-wider hover:text-green-700 transition-all duration-300">
            TravelWithMe
          </span>
        </Link>

        {/* Navigation Links (optional children) */}
        <div className="flex space-x-8 text-green-900 text-xl font-medium">
          {children}
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
