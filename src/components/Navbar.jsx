import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { addUser, removeUser } from "../store/slices/userSlice";

const Navbar = () => {
  // State to toggle the mobile menu
  const [isOpen, setIsOpen] = useState(false);
 
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    // Firebase Auth Listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && location.pathname === "/login") {
        // If user is signed in and tries to access /login, redirect to home
        navigate("/");
      }
      if (user) {
        // User is signed in, sync user data to Redux
        const { uid, email, displayName } = user;
        dispatch(addUser({ uid, email, displayName }));
      } else {
        // No user is signed in, clear Redux store
        dispatch(removeUser());
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

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
            <Link to={"/contact"}><li className="hover:text-blue-400 cursor-pointer">Contact</li></Link>
            <Link to={"/profile"}><li className="hover:text-blue-400 cursor-pointer">Profile</li></Link>
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
