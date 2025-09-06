function UserList({ onlineUsers, onLogout, darkMode }) {
    return (
        <>
        <aside className={`w-64 bg-gray-200 p-4 overflow-y-auto
            ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Usuarios conectados</h2>
                <button onClick={onLogout}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-3
                    text-sm hover:bg-red-600 cursor-pointer"
                >Salir</button>
            </div>
            <ul>
                { onlineUsers.map(u => (
                    
                    <li key={u.uid} className="flex items-center mb-2">
                        <img
                            className="w-8 h-8 rounded-full mr-2" 
                            src={u.photoURL}
                            alt={u.displayName} />
                        <span className="text-sm">{ u.name }</span>
                    </li>
                )) }
            </ul>
        </aside>
        </>
    )
}

export default UserList;