import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "../services/axiosConfig"
import AuthService from "../services/authService"
import { motion, AnimatePresence } from "framer-motion"

const menuVariants = {
  open: { height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
  closed: { height: "4rem", transition: { duration: 0.3, ease: "easeOut" } },
}

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
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
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
                    className="text-white hover:bg-sky-700 hover:font-semibold active:bg-sky-950 py-3 transition"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(!isMenuOpen)
                      handleLogout()
                    }}
                    className="text-white hover:bg-sky-700 hover:font-semibold active:bg-sky-950 py-3 transition"
                  >
                    Salir
                  </button>
                </nav>
              ) : (
                <nav className="flex flex-col mb-3">
                  <Link
                    to="/login"
                    className="text-white hover:bg-sky-700 hover:font-semibold active:bg-sky-950 py-3 transition"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:bg-sky-700 hover:font-semibold active:bg-sky-950 py-3 transition"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    Registrarse
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
