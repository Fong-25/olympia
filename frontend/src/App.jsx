import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/Signup.jsx'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Lobby from './pages/Lobby.jsx'
import { SocketProvider } from './contexts/SocketContext.jsx'
import Test from './pages/Test.jsx'
import Profile from './pages/User.jsx'

export default function App() {
  return (
    <div className='min-h-screen bg-background'>
      <Router>
        <Toaster position='top-right' />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />

          <Route
            path='/*'
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <Routes>
                    <Route path='/lobby' element={<Lobby />} />
                    <Route path='/test' element={<Test />} />
                    <Route path='/' element={<Lobby />} />
                    <Route path='/profile' element={<Profile />} />
                  </Routes>
                </SocketProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}