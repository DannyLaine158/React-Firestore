import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import UserList from "../components/chat/UserList";
import MessageList from "../components/chat/MessageList";
import MessageForm from "../components/chat/MessageForm";
import { Menu, X, Moon, Sun } from "lucide-react";

function Chat() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [ onlineUsers, setOnlineUsers ] = useState([]);
    const [ messages, setMessages ] = useState([]);
    const [ text, setText ] = useState('');
    const [ showSideBar, setShowSideBar ] = useState(true);
    const [ darkMode, setDarkMode ] = useState(false);
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
        <div className={`flex h-screen relative overflow-hidden transition-colors duration-300
                        ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            {/* Botón toggle */}
            <button
                className="absolute top-1 z-20 bg-gray-800 text-white 
                    p-2 rounded-full shadow hover:bg-gray-700 cursor-pointer"
                onClick={() => setShowSideBar(!showSideBar)}
                >
                { showSideBar ? <X size={20} /> : <Menu size={20} /> }
            </button>

            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute bottom-20 right-1 z-20 bg-gray-800 text-white 
                    p-2 rounded-full shadow hover:bg-gray-700 cursor-pointer"
                >
                { darkMode ? <Sun size={20} /> : <Moon size={20} /> }
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-200 p-4 
                overflow-y-auto transform transition-transform duration-300 ease-in-out z-10
                ${showSideBar ? "translate-x-0" : "-translate-x-full"}
                ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}
                `}
            >
                <UserList onlineUsers={onlineUsers} onLogout={handleLogout} />
            </aside>

            {/* Contenido principal */}
            <main
                className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300
                ${showSideBar ? "md:ml-64" : "ml-0 w-full"}
                ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}
                `}
            >
                <MessageList messages={messages} user={user} chatEndRef={chatEndRef}
                    darkMode={darkMode} />
                <MessageForm text={text} setText={setText} onSend={handleSend} />
            </main>
        </div>

    )    
}

export default Chat;