import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

function Login() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const saveUser = async () => {
            if (!user) return;
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                    online: true
                });
                console.log("Usuario creado en firestore");
            } else {
                console.log("Usuario ya existía en DB");
            }

            navigate('/chat');
        }

        saveUser();
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
    try {
      // Proveedor para hacer login
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al hacer login ", error);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl mb-4 font-bold">Bienvenido al Chat</h1>
        <button 
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 
          py-2 rounded hover:bg-red-600 cursor-pointer">
          Iniciar Sesión con Google
        </button>
      </div>
    </div>
  )
}

export default Login;