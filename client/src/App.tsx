import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminBooks from './pages/AdminBooks'
import AdminDashboard from './pages/AdminDashboard'
import Books from './pages/Books'
import Login from './pages/Login'
import Register from './pages/Register'
import Cancel from './pages/strippePages/Cancel'
import Success from './pages/strippePages/Success'
import TaskCreated from './pages/TaskCreated'
import UserProfile from './pages/UserProfile'
import { loadUser } from './redux/auth/authSlice'
import { useAppDispatch } from './redux/hook'

function App() {

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

            <Route path="/user-profile" element={
              <ProtectedRoute><UserProfile /></ProtectedRoute>
            } />
            <Route path="/my-tasks" element={
              <ProtectedRoute><TaskCreated /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>
            } />

            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/task-created" element={
              <ProtectedRoute><TaskCreated /></ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
  )
}

export default App
