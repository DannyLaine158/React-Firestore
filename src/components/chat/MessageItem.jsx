function MessageItem({ msg, user, darkMode }) {
    const formatTime = (timeStamp) => {
        if (!timeStamp) return '';
        const date = timeStamp.toDate();
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div key={msg.id}
            className={`mb-3 flex ${
                msg.uid === user.uid ? "justify-end" : "justify-start"
            }`}
        >
            <div className={`max-w-xs bg-white p-2 rounded shadow text-sm
                ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                <div className={`
                    flex items-center mb-1
                    ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}
                    `}>
                    <img
                        className="w-5 h-5 rounded-full mr-2"
                        src={msg.photoURL} 
                        alt={msg.displayName} />
                    <span className="font-semibold">
                        { msg.uid === user.uid ? 'Tú' : msg.displayName }
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                        { formatTime(msg.timestamp) }
                    </span>
                </div>
                <p>{ msg.text }</p>
            </div>
        </div>
    )
}

export default MessageItem;