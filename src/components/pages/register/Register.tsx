import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
    id: string;
    name: string;
    email: string;
};

type RegisterProps = {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const Register = ({ setUser }: RegisterProps) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth/register", form, {
                headers: { "Content-Type": "application/json" }
            });

            setUser(res.data.user);
            navigate("/");
        } catch (err: any) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center">
            <div className="max-w-sm flex items-center mx-auto border p-4 overflow-hidden bg-linear-to-br from-slate-400 via-slate-300 to-slate-600 rounded-lg">
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <h2 className="text-center font-semibold">Register</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <input
                        type="text"
                        placeholder="name"
                        className="border border-slate-200/60 rounded-lg p-2 w-full mb-3"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="email"
                        className="border border-slate-200/60 rounded-lg p-2 w-full mb-3"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        className="border border-slate-200/60 rounded-lg p-2 w-full mb-3"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button className="w-full font-bold p-2 bg-linear-to-r from-black/90 to-black/80 rounded text-white relative overflow-hidden group hover:scale-102 transform transition duration-300 ease-in-out">
                        <div className=" h-30 top-1/2 rotate-45 -translate-x-20 -translate-y-1/2 -left-2 w-10 absolute bg-slate-200/40
                    group-hover:translate-x-100 transform transition duration-500 ease-in-out brightness-150 blur-2xl"></div>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};
