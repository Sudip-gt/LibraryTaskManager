// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../redux/hook';
// import { logout } from '../redux/auth/authSlice';
// import toast from 'react-hot-toast';

// const Navbar: React.FC = () => {
//   const { pathname } = useLocation();
//   const dispatch = useAppDispatch();
//   const { user } = useAppSelector((state) => state.auth);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const linkStyle = (path: string) =>
//     `px-4 py-2 rounded-md transition ${
//       pathname === path
//         ? 'bg-white text-blue-600 font-semibold'
//         : 'hover:bg-blue-500 hover:text-white'
//     }`;

//   const handleLogout = () => {
//     dispatch(logout());
//     toast.success('Logout successful!');
//     setDropdownOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <nav className="bg-blue-600 text-white shadow-md">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold tracking-wide">
//           Library
//         </Link>

//         <div className="space-x-2 flex items-center" ref={dropdownRef}>
//           {/* Show Books and Tasks only when user is logged in */}
//           {user && (
//             <>
//               <Link to="/" className={linkStyle('/')}>
//                 Books
//               </Link>

//               <Link to="/task-created" className={linkStyle('/task-created')}>
//                 Tasks
//               </Link>
//             </>
//           )}
          
//           {!user ? (
//             <>
//               <Link to="/login" className={linkStyle('/login')}>
//                 Login
//               </Link>
//               <Link to="/register" className={linkStyle('/register')}>
//                 Register
//               </Link>
//             </>
//           ) : (
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 flex items-center gap-2"
//               >
//                 <span>{user.name}</span>
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white text-blue-600 rounded-md shadow-lg z-50">
//                   <Link
//                     to="/user-profile"
//                     onClick={() => setDropdownOpen(false)}
//                     className="block px-4 py-2 hover:bg-blue-100"
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-red-600 hover:bg-blue-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

//--------------------------------------------------------------------------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hook';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const linkStyle = (path: string) =>
    `px-4 py-2 rounded-md transition ${
      pathname === path
        ? 'bg-white text-blue-600 font-semibold'
        : 'hover:bg-blue-500 hover:text-white'
    }`;

const handleLogout = async () => {
  try {
    await dispatch(logoutUser());
    toast.success('Logout successful!');
    setDropdownOpen(false);
    navigate('/login');
  } catch (error: unknown) {
    console.error('Logout error:', error);
    toast.error('Logout failed!');
  }
};

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to={user ? "/" : "/login"} 
          className="text-2xl font-bold tracking-wide hover:text-blue-200 transition-colors"
          aria-label="Library Home"
        >
          Library
        </Link>

        <div className="hidden md:flex space-x-2 items-center" ref={dropdownRef}>
          {user && (
            <>
              <Link to="/" className={linkStyle('/')} aria-label="Books">
                Books
              </Link>

              <Link to="/task-created" className={linkStyle('/task-created')} aria-label="Tasks">
                Tasks
              </Link>
            </>
          )}
          
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
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 flex items-center gap-2 transition-colors"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label={`User menu for ${user.name}`}
              >
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-24 truncate">{user.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
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
                <div className="absolute right-0 mt-2 w-40 bg-white text-blue-600 rounded-md shadow-lg z-50 border">
                  <Link
                    to="/user-profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-blue-500 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500" ref={mobileMenuRef}>
          <div className="px-4 py-2 space-y-1">
            {user && (
              <>
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-md ${pathname === '/' ? 'bg-white text-blue-600 font-semibold' : 'hover:bg-blue-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Books
                </Link>
                <Link
                  to="/task-created"
                  className={`block px-3 py-2 rounded-md ${pathname === '/task-created' ? 'bg-white text-blue-600 font-semibold' : 'hover:bg-blue-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tasks
                </Link>
                <Link
                  to="/user-profile"
                  className="block px-3 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-red-200 hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>
              </>
            )}
            
            {!user && (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md ${pathname === '/login' ? 'bg-white text-blue-600 font-semibold' : 'hover:bg-blue-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block px-3 py-2 rounded-md ${pathname === '/register' ? 'bg-white text-blue-600 font-semibold' : 'hover:bg-blue-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;