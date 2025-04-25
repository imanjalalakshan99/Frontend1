import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

interface Props {
  children?: React.ReactNode;
}

const NavBar = ({ children }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-green-300 shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          {/* Logo + Site Name */}
          <Link to="/" reloadDocument className="flex items-center text-green-900">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-wide hover:text-green-700 transition">
              TravelWithMe
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-xl text-green-900 font-medium">
            {children}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-green-900 text-3xl focus:outline-none"
            >
              {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Links */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-4 pb-4 animate-fadeIn">
            {React.Children.map(children, (child) => (
              <div className="text-green-900 text-lg font-semibold px-2 hover:text-green-700 transition">
                {child}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
