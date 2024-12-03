import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Navbar = () => {
  // State to toggle the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <div className="text-2xl font-bold">
            Rate<span className="text-blue-500">Company</span>
          </div>

          {/* Menu for Larger Screens */}
          <ul className="hidden md:flex space-x-6">
          <Link to={"/"}><li className="hover:text-blue-400 cursor-pointer">Home</li></Link>
            <Link to={"/about"}><li className="hover:text-blue-400 cursor-pointer">About</li></Link>
            <Link to={"/services"}><li className="hover:text-blue-400 cursor-pointer">Services</li></Link>
            <Link to={"/contact"}><li className="hover:text-blue-400 cursor-pointer">Contact</li></Link>
          </ul>

          {/* Hamburger Menu for Mobile */}
          <button
            className="md:hidden block text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-700">
            <ul className="flex flex-col space-y-2 p-4">
            <Link to={"/"}><li className="hover:text-blue-400 cursor-pointer">Home</li></Link>
            <Link to={"/about"}><li className="hover:text-blue-400 cursor-pointer">About</li></Link>
            <Link to={"/services"}><li className="hover:text-blue-400 cursor-pointer">Services</li></Link>
            <Link to={"/contact"}><li className="hover:text-blue-400 cursor-pointer">Contact</li></Link>
            <Link to={"/profile"}><li className="hover:text-blue-400 cursor-pointer">Profile</li></Link>
            </ul>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
