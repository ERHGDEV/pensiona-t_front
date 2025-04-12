import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "../services/axiosConfig"
import AuthService from "../services/authService"
import { motion, AnimatePresence } from "framer-motion"
import DashboardIcon from "./icons/DashboardIcon"
import LogoutIcon from "./icons/LogoutIcon"
import LoginIcon from "./icons/LoginIcon"
import RegisterIcon from "./icons/RegisterIcon"
import CloseIcon from "./icons/CloseIcon"
import MenuIcon from "./icons/MenuIcon"

const menuVariants = {
  open: { height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
  closed: { height: "4rem", transition: { duration: 0.3, ease: "easeOut" } },
}

const menuitemsStyles = "flex text-white text-left hover:bg-sky-700 hover:font-semibold active:bg-sky-950 py-4 transition"

export default function Header() {
  const navigate = useNavigate()
  const isLoggedIn = AuthService.isAuthenticated()
  const userRole = AuthService.getUserRole()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/logout", {
        email: AuthService.getUsername(),
      })

      if (response.data.success) {
        AuthService.logout()
        navigate("/login")
      } else {
        alert("Error al cerrar sesión, intenta de nuevo")
      }
    } catch (error) {
      alert("Error al cerrar sesión, intenta de nuevo")
    }
  }

  return (
    <motion.header
      className="bg-sky-900 shadow-lg sticky top-0 z-50 overflow-hidden"
      animate={isMenuOpen ? "open" : "closed"}
      initial="closed"
      variants={menuVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-sky-200 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Pensiona-T
          </Link>
          <nav className="hidden md:flex space-x-10">
            {isLoggedIn ? (
              <>
                {userRole === "admin" && (
                  <Link
                    to="/admin"
                    className="text-base font-medium text-white hover:text-sky-200 transition"
                  >
                    Dashboard
                  </Link>
                )}
                {userRole === "user" && (
                  <Link
                    to="/user"
                    className="text-base font-medium text-white hover:text-sky-200 transition"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-base font-medium text-white hover:text-sky-200 transition"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-medium text-white hover:text-sky-200 transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="text-base font-medium text-white hover:text-sky-200 transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
          <button
            type="button"
            className="bg-sky-900 p-2 rounded-md text-white hover:bg-sky-800 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {(isMenuOpen || window.innerWidth >= 768) && (
            <motion.nav
              className="flex flex-col text-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {isLoggedIn ? (
                <nav className="flex flex-col mb-3">
                  <Link
                    to={userRole === "admin" ? "/admin" : "/user"}
                    className={menuitemsStyles}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <DashboardIcon className="w-6 h-6 inline-block mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(!isMenuOpen)
                      handleLogout()
                    }}
                    className={menuitemsStyles}
                  >
                    <LogoutIcon className="w-6 h-6 inline-block mr-2" />
                    Cerrar sesión
                  </button>
                </nav>
              ) : (
                <nav className="flex flex-col mb-3">
                  <Link
                    to="/login"
                    className={menuitemsStyles}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <LoginIcon className="w-6 h-6 inline-block mr-2" />
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className={menuitemsStyles}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <RegisterIcon className="w-6 h-6 inline-block mr-2" />
                    Registrarme
                  </Link>
                </nav>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
