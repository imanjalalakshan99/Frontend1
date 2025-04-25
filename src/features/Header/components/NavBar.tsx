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
          
          <span className="text-2xl font-bold tracking-wide hover:text-green-100 transition">
            TravelWithMe
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-white text-lg">
          {children}
        </div>

    

      </div>
    </nav>
  );
};

export default NavBar;
