function MessageForm({ text, setText, onSend }) {
    return (
        <form onSubmit={onSend}
            className="bg-white p-4 flex items-center border-1">
            <input 
                value={text}
                onChange={(e) => setText(e.target.value)}
                type="text" 
                className="flex-1 p-2 border rounded mr-2"
                placeholder="Escribe un mensaje" />

            <button
                className="bg-blue-500 text-white px-4 py-2 
                    rounded hover:bg-blue-600">
                Enviar
            </button>
        </form>
    );
}

export default MessageForm;