import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cookie = false; // replace with your auth state

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openDialog = () => setIsDialogOpen(!isDialogOpen);
  const signOut = () => alert('Signed out');

  return (
    <nav className="bg-black text-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-teal-400">Help Yaar</span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden sm:flex space-x-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-teal-400 transition ${isActive ? 'text-teal-400' : 'text-gray-300'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-teal-400 transition ${isActive ? 'text-teal-400' : 'text-gray-300'}`
            }
          >
            About Us
          </NavLink>

          {cookie ? (
            <button onClick={openDialog} className="hover:text-teal-400 transition">
              <BsPerson size={22} />
            </button>
          ) : (
            <NavLink
              to="/login"
              className="bg-teal-500 hover:bg-teal-600 text-white px-7 py-1 rounded-sm text-sm transition"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden focus:outline-none hover:text-teal-400 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-black border-t border-gray-700 py-3 space-y-2">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-300 hover:text-teal-400 text-center py-2"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-300 hover:text-teal-400 text-center py-2"
          >
            About Us
          </NavLink>
          {cookie ? (
            <button
              onClick={openDialog}
              className="block mx-auto text-gray-300 hover:text-teal-400 py-2"
            >
              <BsPerson size={22} />
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block text-center bg-teal-500 hover:bg-teal-600 text-white mx-10 py-2 rounded-lg"
            >
              Login / Sign Up
            </NavLink>
          )}
        </div>
      )}

      {/* Sign Out Popup */}
      {isDialogOpen && (
        <div className="absolute top-16 right-4 bg-white text-gray-800 rounded-lg shadow-md py-2 w-32">
          <h3
            onClick={signOut}
            className="cursor-pointer px-4 py-2 hover:bg-gray-200 text-center"
          >
            Sign out
          </h3>
        </div>
      )}
    </nav>
  );
};
