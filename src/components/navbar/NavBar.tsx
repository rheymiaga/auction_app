import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { HiOutlineLogout } from "react-icons/hi";


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

    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout")
            setUser(null)
            navigate('/')
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <nav className="p-3 fixed top-0 left-1/2 -translate-x-1/2 w-full flex items-center justify-between max-w-6xl ">
            <Link to={'/'}
                className="font-bold text-transparent bg-linear-to-r from-purple-400 via-purple-200 to-purple-500 hover:from-green-400 hover:via-green-200 hover:to-green-500
                text-shadow-lg text-shadow-purple-300/10 bg-clip-text text-xl transition transform duration-500"
            >
                Auction Xpress
            </Link>
            <aside>
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="p-2 flex gap-1 items-center group hover:scale-105 transform transition duration-500 ease-in-out from-red-500/15 hover:from-red-500 to-purple-500 hover:to-purple-500/15 hover:shadow-sm bg-linear-to-tr rounded font-bold text-white"
                    >
                        <HiOutlineLogout className="group-hover:translate-x-1 transition transform duration-300 ease-in-out" /> Logout
                    </button>
                ) : (
                    <div className="space-x-4 text-white">
                        <Link className="p-2" to={'/login'}>
                            Login
                        </Link>
                        <Link className="p-2" to={'/register'}>
                            Register
                        </Link>
                    </div>
                )}
            </aside>
        </nav>
    )
}
