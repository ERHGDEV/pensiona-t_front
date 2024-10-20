const Notification = ({ showNotification, message, type }) => {
    
    return (
        <>
            {showNotification && (
                <div className={`fixed top-24 left-1/2 transform -translate-x-1/2
                    ${type === 'error' ?
                        'bg-red-500 text-white' :
                        'bg-green-500 text-black'}
                        px-4 py-2 rounded shadow-lg z-50
                    `}
                >
                    {message}
                </div>
            )}
        </>
    )
}

export default Notification