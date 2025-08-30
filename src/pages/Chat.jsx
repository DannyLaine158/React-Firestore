import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function Chat() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [ onlineUsers, setOnlineUsers ] = useState([]);
    const [ messages, setMessages ] = useState([]);
    const [ text, setText ] = useState('');
    const chatEndRef = useRef(null);

    // Carga los mensajes
    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, []);

    // Carga los usuarios
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "users")),
            (snapshot) => {
                const onlineUsers = snapshot.docs
                .map((doc) => doc.data())
                .filter((u) => u.online);
                setOnlineUsers(onlineUsers);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        await addDoc(collection(db, "messages"), {
            text,
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            timestamp: serverTimestamp()
        });

        setText('');
        scrollToBottom();
    }

    const formatTime = (timeStamp) => {
        if (!timeStamp) return '';
        const date = timeStamp.toDate();
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div className="flex h-screen">
            { /* Panel izquierdo de usuarios */ }
            <aside className="w-64 bg-gray-200 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Usuarios conectados</h2>
                    <button onClick={handleLogout}
                        className="bg-red-500 text-white px-2 py-1 rounded 
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

            <main className="flex-1 flex flex-col bg-gray-100">
                { /* Area de mensajes */ }
                <div className="flex-1 overflow-y-auto p-4">
                    { messages.map((msg) => (
                        <div key={msg.id}
                            className={`mb-3 flex ${
                                msg.uid === user.uid ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div className="max-w-xs bg-white p-2 rounded shadow text-sm">
                                <div className="flex items-center mb-1">
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
                    )) }
                    <div ref={chatEndRef}></div>
                </div>

                { /* Formulario para enviar mensajes */ }
                <form onSubmit={handleSend}
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
            </main>
        </div>
    )    
}

export default Chat;