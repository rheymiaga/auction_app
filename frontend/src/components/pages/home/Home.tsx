import { MdAppRegistration } from "react-icons/md";
import { TbLogin2 } from "react-icons/tb";
import { Link } from "react-router-dom";
import bid from "../../../assets/bid.png";

interface User {
    id: string;
    name: string;
    email: string;
}

interface HomeProps {
    user: User | null;
    error?: string;
}

export const Home = ({ user, error }: HomeProps) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 overflow-hidden relative">
            {/* Decorative glowing accents */}
            <div className="absolute w-72 h-72 bg-purple-600/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
            <div className="absolute w-72 h-72 bg-amber-500/30 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>

            <div className="w-full max-w-6xl px-6 relative z-10">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {user ? (
                    <></>
                ) : (
                    <div className="flex flex-col lg:flex-row items-center gap-12 mt-10">
                        {/* Hero Text */}
                        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight drop-shadow-xl">
                                <span className="block text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-600 animate-pulse">
                                    AUCTION
                                </span>
                                <span className="block text-transparent bg-clip-text bg-linear-to-r from-purple-300 via-amber-400 to-amber-700">
                                    XPRESS
                                </span>
                            </h1>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium italic text-transparent bg-clip-text bg-linear-to-r from-purple-200 to-amber-400">
                                Click. Compete. Conquer.
                            </h2>

                            {/* Buttons */}
                            <div className="flex gap-6 mt-6">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-purple-500/50 hover:scale-105 transform transition duration-300 ease-in-out"
                                >
                                    <TbLogin2 /> Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-amber-500 to-orange-600 shadow-lg hover:shadow-amber-500/50 hover:scale-105 transform transition duration-300 ease-in-out"
                                >
                                    <MdAppRegistration /> Register
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="flex-1 flex justify-center">
                            <div className="relative group">
                                <img
                                    src={bid}
                                    alt="Auction illustration"
                                    className="max-w-md w-full object-contain rounded-2xl shadow-2xl opacity-90 group-hover:opacity-100 transition duration-500 transform group-hover:scale-105"
                                />
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/20 to-amber-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};