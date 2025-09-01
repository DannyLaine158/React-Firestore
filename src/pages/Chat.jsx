import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import UserList from "../components/chat/UserList";
import MessageList from "../components/chat/MessageList";
import MessageForm from "../components/chat/MessageForm";

function Chat() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [ onlineUsers, setOnlineUsers ] = useState([]);
    const [ messages, setMessages ] = useState([]);
    const [ text, setText ] = useState('');
    const [ showSideBar, setShowSidebar ] = useState(true);
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

    return (
        <div className="flex h-screen relative overflow-hidden">
            {/* Boton toggle */}
            <button 
                className="absolute top-4 left-4 z-20 bg-gray-800 text-white px-3 py-1 
                    rounded hover:bg-gray-700"
                onClick={() => setShowSidebar(!showSideBar)}>
                { showSideBar ? "Ocultar" : "Mostrar" }
            </button>

            { /* Panel izquierdo de usuarios */ }
            <aside
                className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-200 p-4 
                    overflow-y-auto transform transition-transform duration-300 
                    ease-in-out z-10
                    ${showSideBar ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0`}
            >
                <UserList onlineUsers={onlineUsers} onLogout={handleLogout} />
            </aside>

            <main className="flex-1 flex flex-col bg-gray-100">
                { /* Area de mensajes */ }
                <MessageList messages={messages} user={user} chatEndRef={chatEndRef} />

                { /* Formulario para enviar mensajes */ }
                <MessageForm text={text} setText={setText} onSend={handleSend} />
            </main>
        </div>
    )    
}

export default Chat;