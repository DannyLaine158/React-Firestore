import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/chat" element={
          <ProtectedRoutes>
            <Chat />
          </ProtectedRoutes>
        }></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
