import React, { useState } from 'react';

const Navbar = () => {
  // State to toggle the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold">
          Rate<span className="text-blue-500">Company</span>
        </div>

        {/* Menu for Larger Screens */}
        <ul className="hidden md:flex space-x-6">
          <li className="hover:text-blue-400 cursor-pointer">Home</li>
          <li className="hover:text-blue-400 cursor-pointer">About</li>
          <li className="hover:text-blue-400 cursor-pointer">Services</li>
          <li className="hover:text-blue-400 cursor-pointer">Contact</li>
        </ul>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden block text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-700">
          <ul className="flex flex-col space-y-2 p-4">
            <li className="hover:text-blue-400 cursor-pointer">Home</li>
            <li className="hover:text-blue-400 cursor-pointer">About</li>
            <li className="hover:text-blue-400 cursor-pointer">Services</li>
            <li className="hover:text-blue-400 cursor-pointer">Contact</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
