import MessageItem from "./MessageItem";

function MessageList({ messages, user, chatEndRef, darkMode }) {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            { messages.map((msg) => (
                <MessageItem key={msg.id} msg={msg} user={user} darkMode={darkMode} />
            ))}
            <div ref={chatEndRef}></div>
        </div>
    )
}

export default MessageList;