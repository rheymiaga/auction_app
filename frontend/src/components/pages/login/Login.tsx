import { useState } from "react";
import { FaArrowLeft, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdAppRegistration } from "react-icons/md";
import api from "../../../services/api";

type User = {
    id: string;
    name: string;
    email: string;
};

type LoginProps = {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const Login = ({ setUser }: LoginProps) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const res = await api.post("/api/auth/login", form, {
                headers: { "Content-Type": "application/json" },
            });

            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);

            navigate("/");
        } catch (err: any) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-black to-indigo-900 relative overflow-hidden">
            {/* Decorative glowing accents */}
            <div className="absolute pointer-events-none w-72 h-72 bg-purple-600/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
            <div className="absolute pointer-events-none w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

            <div className="w-full mx-2 max-w-md bg-gray-900 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.05)] p-8">
                <h2 className="text-4xl font-extrabold text-center text-white mb-6 tracking-wide">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-400 mb-6">Sign in to continue</p>

                {error && <p className="text-red-400 text-center mb-4 font-medium">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="relative flex items-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] rounded-lg bg-gray-900">
                        <FaEnvelope className="absolute left-3 text-purple-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full pl-10 p-3 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative flex items-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] rounded-lg bg-gray-900">
                        <FaLock className="absolute left-3 text-purple-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full pl-10 p-3 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out ${loading
                                ? "bg-gray-700 cursor-not-allowed flex items-center justify-center"
                                : "bg-gray-900 shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(255,255,255,0.05)] hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                                    ></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Links */}
                <div className="flex justify-between items-center mt-8 text-gray-400">
                    <Link to="/" className="flex items-center gap-2 hover:text-white transition">
                        <FaArrowLeft /> Back
                    </Link>
                    <Link to="/register" className="flex items-center gap-2 hover:text-white transition">
                        <MdAppRegistration /> Register
                    </Link>
                </div>
            </div>
        </div>
    );
};