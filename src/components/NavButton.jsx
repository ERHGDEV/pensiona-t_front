export default function NavButton({ label, icon, isActive, onClick }) {
    return (
        <button 
            className={`flex flex-col py-1 w-full border-2 border-sky-900 items-center text-sm transition ${isActive ? 'text-white font-semibold border-b-white' : 'text-gray-300'}`} 
            onClick={onClick}
        >
            <div className="h-6 w-6">{icon}</div>
            {label}
        </button>
    )
}
