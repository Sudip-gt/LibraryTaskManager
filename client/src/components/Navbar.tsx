import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { logout } from '../redux/auth/authSlice';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const linkStyle = (path: string) =>
    `px-4 py-2 rounded-md transition ${
      pathname === path
        ? 'bg-white text-blue-600 font-semibold'
        : 'hover:bg-blue-500 hover:text-white'
    }`;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logout successful!');
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Library
        </Link>

        <div className="space-x-2 flex items-center" ref={dropdownRef}>
          <Link to="/" className={linkStyle('/')}>
            Books
          </Link>

          {!user ? (
            <>
              <Link to="/login" className={linkStyle('/login')}>
                Login
              </Link>
              <Link to="/register" className={linkStyle('/register')}>
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 flex items-center gap-2"
              >
                <span>{user.name}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-blue-600 rounded-md shadow-lg z-50">
                  <Link
                    to="/user-profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-blue-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-blue-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
