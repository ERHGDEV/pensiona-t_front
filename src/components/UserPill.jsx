const UserPill = ({ activeSection, setActiveSection, section, text }) => {
    return (
        <button
                className={`px-4 py-2 rounded-full hover:scale-110 transition duration-300 ease-in-out ${activeSection === section ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700 shadow-md' }`}
                onClick={() => setActiveSection(section)}
        >
            {text}
        </button>
    )
}

export default UserPill