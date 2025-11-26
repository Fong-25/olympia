import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/Signup.jsx'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Lobby from './pages/Lobby.jsx'
import { SocketProvider } from './contexts/SocketContext.jsx'
import Test from './pages/Test.jsx'

export default function App() {
  return (
    <SocketProvider>
      <div className='min-h-screen bg-background'>

        <Router>
          <Toaster position='top-right' />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route
              path='/lobby'
              element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              }
            />
            <Route
              path='/test'
              element={
                <ProtectedRoute>
                  <Test />
                </ProtectedRoute>
              }
            />
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </SocketProvider>
  )
}