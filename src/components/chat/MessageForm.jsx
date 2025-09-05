function MessageForm({ text, setText, onSend, darkMode }) {
    return (
        <form onSubmit={onSend}
            className={`p-4 flex items-center border-1 
             ${darkMode 
                ? "bg-gray-800 border-t border-gray-700" 
                : "bg-white border-t border-gray-200"}`}>
            <input 
                value={text}
                onChange={(e) => setText(e.target.value)}
                type="text" 
                className={`flex-1 p-2 border rounded mr-2 
                    ${darkMode 
                        ? "bg-gray-700 text-white placeholder-gray-400"
                        : "bg-gray-100 text-black placeholder-gray-600"
                    }`}
                placeholder="Escribe un mensaje" />

            <button
                className={`bg-blue-500 text-white px-4 py-2 
                    rounded hover:bg-blue-600 cursor-pointer
                    ${darkMode
                        ? "bg-blue-600 text-white hober:bg-blue-500"
                        : "bg-blue-500 text-white hober:bg-blue-600"
                    }`}>
                Enviar
            </button>
        </form>
    );
}

export default MessageForm;