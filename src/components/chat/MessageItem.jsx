function MessageItem({ msg, user, darkMode }) {
    
    const formatTime = (timeStamp) => {
        if (!timeStamp) return '';
        const date = timeStamp.toDate();
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOwnMessage = msg.uid === user.uid;

    return (
        <div
            key={msg.id}
            className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-xs p-2 shadow text-sm
                    ${isOwnMessage 
                        ? (darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white") 
                        : (darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black border border-gray-300")
                    }
                    ${isOwnMessage 
                        ? "rounded-lg rounded-br-none" 
                        : "rounded-lg rounded-bl-none"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center mb-1">
                    <img
                        className="w-5 h-5 rounded-full mr-2"
                        src={msg.photoURL}
                        alt={msg.displayName}
                    />
                    <span className="font-semibold">
                        {isOwnMessage ? "Tú" : msg.displayName}
                    </span>
                    <span
                        className={`ml-2 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                    >
                        {formatTime(msg.timestamp)}
                    </span>
                </div>

                {/* Texto */}
                <p>{msg.text}</p>
            </div>
        </div>
    );
}

export default MessageItem;
