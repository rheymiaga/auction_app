import axios from "axios";
import { useState } from "react";
import { FaArrowLeft, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { TbLogin2 } from "react-icons/tb";
import { API_URL } from "../../../api";

type User = {
    id: string;
    name: string;
    email: string;
};

type RegisterProps = {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const Register = ({ setUser }: RegisterProps) => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, form, {
                headers: { "Content-Type": "application/json" },
            });

            localStorage.setItem("token", res.data.token);

            setUser(res.data.user);

            navigate("/");
        } catch (err: any) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-black to-purple-900 relative overflow-hidden">
            {/* Decorative glowing circles */}
            <div className="absolute w-72 h-72 bg-purple-600/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
            <div className="absolute w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

            {/* Glassmorphism card */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                <h2 className="text-4xl font-extrabold text-center text-white mb-6 tracking-wide">
                    Create Account
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    Join us and start exploring
                </p>

                {error && (
                    <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="relative">
                        <FaUser className="absolute left-3 top-3 text-purple-400" />
                        <input
                            type="text"
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full pl-10 p-3 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3 text-purple-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full pl-10 p-3 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-purple-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full pl-10 p-3 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 transform transition duration-300 ease-in-out"
                    >
                        Register
                    </button>
                </form>

                {/* Links */}
                <div className="flex justify-between items-center mt-8 text-gray-300">
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:text-white transition"
                    >
                        <FaArrowLeft /> Back
                    </Link>
                    <Link
                        to="/login"
                        className="flex items-center gap-2 hover:text-white transition"
                    >
                        <TbLogin2 /> Login
                    </Link>
                </div>
            </div>
        </div>
    );
};