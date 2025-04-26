import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

interface Props {
  children?: React.ReactNode;
}

const NavBar = ({ children }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-300 via-blue-300 to-green-400 shadow-lg sticky top-0 z-50 transition-all duration-300 font-[Poppins]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo + Site Name */}
          <Link to="/" reloadDocument className="flex items-center text-green-950">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-wider hover:text-blue-800 transition-all duration-300">
              Explore
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 text-xl text-green-950 font-semibold">
            {children}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-green-950 text-4xl focus:outline-none"
            >
              {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Links */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-4 pb-4 animate-fadeIn">
            {React.Children.map(children, (child) => (
              <div className="text-green-950 text-xl font-medium px-2 hover:text-blue-800 transition-all duration-300">
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
