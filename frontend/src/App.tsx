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
import { SiExpertsexchange } from "react-icons/si";
import { RiLoader2Fill } from "react-icons/ri";

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
        <div className="relative w-28 h-28 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">

          <div className="absolute inset-0 rounded-full bg-linear-to-br from-yellow-400 via-yellow-500 to-orange-500 
                        shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.2),inset_6px_6px_12px_rgba(0,0,0,0.4)]">
          </div>

          <span className="text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"><SiExpertsexchange /></span>

          <div className="absolute inset-0 rounded-full bg-linear-to-t from-transparent via-white/20 to-transparent 
                        animate-[scan_2.5s_linear_infinite]"></div>

          <div className="absolute -inset-2 rounded-full border-2 border-yellow-400/40 blur-md animate-pulse"></div>
        </div>

        <div className="absolute top-1/3 right-1/3 text-pink-400 text-3xl animate-spin">
          <RiLoader2Fill />
        </div>

        <p className="mt-10 text-xl md:text-2xl font-semibold tracking-wide text-transparent bg-clip-text 
                   bg-linear-to-r from-yellow-400 via-orange-400 to-pink-400 animate-pulse">
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
