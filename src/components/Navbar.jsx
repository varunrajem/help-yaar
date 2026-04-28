import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openDialog = () => setIsDialogOpen(!isDialogOpen);

  useEffect(() => {
    let logoutTimer;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // 🔥 Clear previous timer
      if (logoutTimer) clearTimeout(logoutTimer);

      if (currentUser) {
        // ⏳ Auto logout after 1 minute
        logoutTimer = setTimeout(async () => {
          try {
            await signOut(auth);
            alert("Session expired! Logged out automatically.");
          } catch (error) {
            console.error("Auto logout error:", error);
          }
        }, 60000); // change time here
      }
    });

    return () => {
      unsubscribe();
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  // 🔥 Manual Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
              `hover:text-teal-400 ${isActive ? 'text-teal-400' : 'text-gray-300'}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-teal-400 ${isActive ? 'text-teal-400' : 'text-gray-300'}`
            }
          >
            About Us
          </NavLink>

          {/* 🔥 USER LOGIC */}
          {user ? (
            <div className="relative">

              {/* 👤 USER NAME */}
              <button
                onClick={openDialog}
                className="flex items-center gap-2 hover:text-teal-400"
              >
                <BsPerson size={20} />
                <span className="text-sm font-medium">
                  {user.displayName || user.email}
                </span>
              </button>

              {/* 🔥 DROPDOWN */}
              {isDialogOpen && (
                <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-md w-32">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 hover:bg-gray-200 text-center"
                  >
                    Logout
                  </button>
                </div>
              )}

            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-teal-500 hover:bg-teal-600 px-7 py-1 rounded-sm text-sm"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="sm:hidden">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-black border-t border-gray-700 py-3 space-y-2">

          <NavLink to="/" className="block text-center py-2">Home</NavLink>
          <NavLink to="/about" className="block text-center py-2">About</NavLink>

          {user ? (
            <>
              <p className="text-center">{user.displayName || user.email}</p>
              <button
                onClick={handleLogout}
                className="block mx-auto bg-red-500 px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="block text-center bg-teal-500 mx-10 py-2 rounded"
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};