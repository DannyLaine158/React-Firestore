import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, {
                    online: true,
                    lastLogin: serverTimestamp()
                });
            }
        });

        const handleBeforeUnload = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "user", auth.currentUser.uid);
                await updateDoc(userRef, {
                    online: false,
                    lastLogout: serverTimestamp()
                });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            unsubscribe();
        }
    }, []);

    const logout = async () => {
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, {
                online: false,
                lastLogout: serverTimestamp()
            });
        }

        await signOut(auth);
    }

    return (
        <AuthContext.Provider value={{ user, logout }}>
            { !loading && children }
        </AuthContext.Provider>
    )
}