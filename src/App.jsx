import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
import PageTransition from './components/PageTransition'
import Header from './components/Header'
import AboutUs from './pages/AboutUs'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<PageTransition><AdminPanel /></PageTransition>} />
          <Route path="/user" element={<PageTransition><UserPanel /></PageTransition>} />
        </Route>

        <Route path="/status" element={<PageTransition><PaymentStatus /></PageTransition>} />
        <Route path='/register' element={<PageTransition><Register /></PageTransition>} />
        <Route path="/verify" element={<PageTransition><Verify /></PageTransition>} />
        <Route path="/password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/recovery" element={<PageTransition><Recovery /></PageTransition>} />
        <Route path="/privacity" element={<PageTransition><Privacity /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Subscriptions /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <Header />
      <AnimatedRoutes />
    </Router>
  )
}

export default App
