const MenuIcon = ({ className = "", ...props }) => (
  <svg
    className={`h-6 w-6 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export default MenuIcon