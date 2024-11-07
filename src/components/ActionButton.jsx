const ActionButton = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="bg-sky-600 hover:bg-sky-500 active:bg-sky-700
        text-lg text-white font-bold 
        py-3 px-8 rounded-full  
        transition duration-300 ease-in-out 
        inline-flex items-center sm:max-w-fit sm:mx-auto"
    >
        {children}
        <span className="ml-2">→</span>
    </button>
)

export default ActionButton
