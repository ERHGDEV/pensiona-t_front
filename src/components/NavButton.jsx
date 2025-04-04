export default function NavButton({ label, icon, isActive, onClick }) {
    return (
        <button 
            className={`flex flex-col py-1 w-full border-2 border-white items-center text-sm transition ${isActive ? 'text-sky-700 font-semibold border-b-sky-700' : 'text-gray-500'}`} 
            onClick={onClick}
        >
            <div className="h-6 w-6">{icon}</div>
            {label}
        </button>
    )
}
