import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function ProtectedRoutes({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to={'/'} />
    }

    return children;
}

export default ProtectedRoutes;