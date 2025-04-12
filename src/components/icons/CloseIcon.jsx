const CloseIcon = ({ className = "", ...props }) => (
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
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
  
  export default CloseIcon  