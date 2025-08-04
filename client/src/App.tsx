import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Books from './pages/Books'
import { Toaster } from 'react-hot-toast'
import UserProfile from './pages/UserProfile'
import { useEffect } from 'react'
import { useAppDispatch } from './redux/hook'
import { loadUser } from './redux/auth/authSlice'

function App() {

  ////////////////////////// to load user from token after login on refresh
  const dispatch = useAppDispatch();

  useEffect(() => {
  const loggedOut = localStorage.getItem('loggedOut') === 'true';
  if (!loggedOut) {
    dispatch(loadUser());
  }
}, [dispatch]);

  return (
      <Router>
        <Toaster position='top-center'/>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Books />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-profile" element={<UserProfile />} />
          </Routes>
        </div>
      </Router>
  )
}

export default App
