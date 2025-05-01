export default function NavButton({ label, icon, isActive, onClick }) {
    return (
        <button 
            className={`flex flex-col pt-2 pb-1 w-full border-[1px] 
                border-sky-900 items-center text-sm transition 
                ${isActive ? 'text-white border-t-white' : 'text-gray-400'}`} 
            onClick={onClick}
        >
            <div className="h-6 w-6 mb-1">{icon}</div>
            {label}
        </button>
    )
}
