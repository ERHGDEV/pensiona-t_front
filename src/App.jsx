import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'
import UserPanel from './pages/UserPanel'
import Register from './pages/Register'
import Verify from './pages/Verify'
import Recovery from './pages/Recovery'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import Privacity from './pages/Privacity'
import Subscriptions from './pages/Subscriptions'
import PaymentStatus from './pages/PaymentStatus'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/user" element={<UserPanel />} />
        </Route>
        <Route path="/status" element={<PaymentStatus />} />
        <Route path='/register' element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/password" element={<ForgotPassword />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/privacity" element={<Privacity />} />
        <Route path="/pricing" element={<Subscriptions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App