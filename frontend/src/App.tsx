import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/navbar/NavBar";
import { Home } from "./components/pages/home/Home";
import { Login } from "./components/pages/login/Login";
import { Register } from "./components/pages/register/Register";
import { Dashboard } from "./components/pages/dashboard/Dashboard";
import { ItemForm } from "./components/pages/items/ItemForm";
import Marketplace from "./components/pages/marketplace/MarketPlace";
import { MyOffers } from "./components/pages/offers/MyOffers";
import api from "./services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem("token")) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-tr from-black/70 to-purple-600/30 text-white">
        {/* Spinner */}
        <div className="w-20 h-20 rounded-full border-4 border-t-transparent border-purple-400 animate-spin shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(255,255,255,0.05)]"></div>

        {/* Text */}
        <p className="mt-6 text-xl font-semibold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-pink-400 animate-pulse">
          Preparing Auction_Xpress...
        </p>
      </div>
    );
  }

  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Navbar / Sidebar */}
      {user && !hideNavbar && (
        <div className="lg:w-64">
          <Navbar user={user} setUser={setUser} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home user={user} />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/items/new"
            element={user ? <ItemForm /> : <Navigate to="/" />}
          />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/my-offers"
            element={user ? <MyOffers /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>

      </div>
    </div>
  );
}

export default App;
