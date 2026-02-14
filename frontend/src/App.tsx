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
import api from "./services/api"

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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-tr from-black/50 to-purple-500/30 flex items-center justify-center text-white">
        <p className="transition-all duration-300 ease-in-out animate-bounce text-2xl font-bold">
          Loading...
        </p>
      </div>
    );
  }

  // Hide navbar on login/register routes
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
