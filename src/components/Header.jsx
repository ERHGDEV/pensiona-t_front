import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "../services/axiosConfig"
import AuthService from "../services/authService"
import { motion, AnimatePresence } from "framer-motion"

const buttonStyles =
  "py-4 px-3 flex justify-end rounded-md hover:bg-gray-100 font-medium text-gray-900 transition duration-300 ease-in-out"

const menuVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  closed: {
    opacity: 0,
    height: 0,
    transformOrigin: "top right",
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

export default function Header() {
  const navigate = useNavigate()
  const isLoggedIn = AuthService.isAuthenticated()
  const userRole = AuthService.getUserRole()
  const email = AuthService.getUsername()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null) 

  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) 
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/logout", { email })

      if (response.data.success) {
        AuthService.logout()
        navigate("/login")
      } else {
        console.error("Error during logout:", response.data.message)
        alert("Error al cerrar sesión, intenta de nuevo")
      }
    } catch (error) {
      console.error("Error during logout:", error)
      alert("Error al cerrar sesión, intenta de nuevo")
    }
  }

  return (
    <header className="bg-sky-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex lg:w-0 lg:flex-1">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-sky-200 transition duration-150 ease-in-out"
            >
              Pensiona-T
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <button
              ref={buttonRef} 
              type="button"
              className="bg-sky-900 rounded-md p-2 inline-flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">Toggle menu</span>
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
          <nav className="hidden md:flex space-x-10">
            {isLoggedIn ? (
              <>
                {userRole === "admin" && (
                  <Link
                    to="/admin"
                    className="text-base font-medium text-white hover:text-sky-200"
                  >
                    Dashboard
                  </Link>
                )}
                {userRole === "user" && (
                  <Link
                    to="/user"
                    className="text-base font-medium text-white hover:text-sky-200"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-base font-medium text-white hover:text-sky-200"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-medium text-white hover:text-sky-200"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="text-base font-medium text-white hover:text-sky-200"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            className="absolute top-full right-0 mt-2 w-64 transition-transform origin-top-right md:hidden overflow-hidden shadow-lg"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
              <div className="py-4 px-5">
                <nav className="grid text-right">
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          navigate(userRole === "admin" ? "/admin" : "/user")
                        }}
                        className={buttonStyles}
                      >
                        Ir a Dashboard
                      </button>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className={buttonStyles}
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          navigate("/login")
                        }}
                        className={buttonStyles}
                      >
                        Iniciar sesión
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          navigate("/register")
                        }}
                        className={buttonStyles}
                      >
                        Registrarse
                      </button>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
