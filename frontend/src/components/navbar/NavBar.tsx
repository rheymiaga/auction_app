import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { SiExpertsexchange } from "react-icons/si";
import { MdAppRegistration, MdDashboard } from "react-icons/md";
import { TbLogin2 } from "react-icons/tb";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegListAlt } from "react-icons/fa";
import { API_URL } from "../../api";

interface User {
    id: string;
    name: string;
    email: string;
}

interface NavbarProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const Navbar = ({ user, setUser }: NavbarProps) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/api/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem("token");
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    // Prevent background scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const linkClasses = (isActive: boolean) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${isActive
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`;

    if (user) {
        return (
            <>
                {/* Large screen sidebar */}
                <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-black/80 backdrop-blur-md border-r border-gray-700 flex-col z-50">
                    <div className="p-6 text-center border-b border-gray-700">
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 flex items-center justify-center gap-2">
                            <SiExpertsexchange className="text-purple-400" /> Auction_Xpress
                        </h1>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <NavLink to="/dashboard" className={({ isActive }) => linkClasses(isActive)}>
                            <MdDashboard /> Dashboard
                        </NavLink>
                        <NavLink to="/marketplace" className={({ isActive }) => linkClasses(isActive)}>
                            <HiOutlineShoppingCart /> Marketplace
                        </NavLink>
                        <NavLink to="/items/new" className={({ isActive }) => linkClasses(isActive)}>
                            <FaRegListAlt /> Post Item
                        </NavLink>
                        <NavLink to="/my-offers" className={({ isActive }) => linkClasses(isActive)}>
                            My Offers
                        </NavLink>
                    </nav>

                    <div className="p-4 border-t border-gray-700 flex items-center justify-between text-white">
                        <span className="font-semibold">{user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-linear-to-r from-red-600 to-pink-600 hover:scale-105 transition shadow-md"
                        >
                            <HiOutlineLogout /> Logout
                        </button>
                    </div>
                </aside>

                {/* Mobile/Tablet navbar */}
                <nav className="lg:hidden fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-gray-700 flex items-center justify-between p-4 z-50">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                        {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
                    </button>
                    <h1 className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 font-bold flex items-center gap-2">
                        <SiExpertsexchange className="text-purple-400" /> Auction_Xpress
                    </h1>
                </nav>

                {/* Drawer for mobile/tablet */}
                {isOpen && (
                    <div className="fixed inset-0 top-15 z-40 flex">
                        {/* Backdrop overlay */}
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        ></div>

                        {/* Drawer */}
                        <aside className="relative z-50 w-64 bg-black/90 backdrop-blur-md border-r border-gray-700 flex flex-col transform transition-transform duration-300">
                            <nav className="flex-1 p-4 space-y-2">
                                <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={({ isActive }) => linkClasses(isActive)}>
                                    <MdDashboard /> Dashboard
                                </NavLink>
                                <NavLink to="/marketplace" onClick={() => setIsOpen(false)} className={({ isActive }) => linkClasses(isActive)}>
                                    <HiOutlineShoppingCart /> Marketplace
                                </NavLink>
                                <NavLink to="/items/new" onClick={() => setIsOpen(false)} className={({ isActive }) => linkClasses(isActive)}>
                                    <FaRegListAlt /> Post Item
                                </NavLink>
                                <NavLink to="/my-offers" onClick={() => setIsOpen(false)} className={({ isActive }) => linkClasses(isActive)}>
                                    My Offers
                                </NavLink>
                            </nav>

                            <div className="p-4 border-t border-gray-700 flex items-center justify-between text-white">
                                <span className="font-semibold">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-linear-to-r from-red-600 to-pink-600 hover:scale-105 transition shadow-md"
                                >
                                    <HiOutlineLogout /> Logout
                                </button>
                            </div>
                        </aside>
                    </div>
                )}
            </>
        );
    }

    // Public navbar (not logged in)
    return (
        <nav className="p-3 fixed top-0 left-0 w-full flex items-center z-50 bg-black/70 backdrop-blur-md border-b border-gray-700">
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center gap-2 font-bold transition ${isActive
                            ? "text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500"
                            : "text-purple-300 hover:text-purple-400"
                        }`
                    }
                >
                    <SiExpertsexchange className="text-2xl" />
                    <span className="hidden sm:inline">Auction_Xpress</span>
                </NavLink>

                <div className="space-x-4 flex text-white">
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `px-3 py-2 flex items-center gap-1 rounded-lg transition ${isActive
                                ? "bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                                : "hover:scale-105 hover:text-purple-400"
                            }`
                        }
                    >
                        <TbLogin2 /> Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            `px-3 py-2 flex items-center gap-1 rounded-lg transition ${isActive
                                ? "bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                                : "hover:scale-105 hover:text-purple-400"
                            }`
                        }
                    >
                        <MdAppRegistration /> Register
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};