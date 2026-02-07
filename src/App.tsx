import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/navbar/NavBar";
import { Home } from "./components/pages/home/Home";
import { Login } from "./components/pages/login/Login";
import { Register } from "./components/pages/register/Register";

interface User {
  id: string;
  name: string;
  email: string;
}

// Configure axios
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-linear-to-tr from-black/50 to-purple-500/30 flex items-center justify-center text-white 
    ">
      <p className="transition-all duration-300 ease-in-out animate-bounce text-2xl font-bold">Loading...</p>
    </div>
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
      </Routes>
    </>
  );
}

export default App;