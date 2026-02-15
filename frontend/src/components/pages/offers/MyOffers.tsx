import { useEffect, useState } from "react";
import api from "../../../services/api";
import imagePlaceholder from "../../../assets/imagePlaceholder.jpg";

interface MyOffer {
    id: number;
    item_name: string;
    seller_name: string;
    offer_price: number;
    status: string;
    created_at?: string;
    img_url?: string | null;
}

export const MyOffers = () => {
    const [offers, setOffers] = useState<MyOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setIsLoading(true);
                const res = await api.get("/api/auth/my-offers");
                setOffers(res.data);
            } catch {
                setErrorMessage("Failed to fetch offers.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const deleteOffer = async (id: number) => {
        try {
            await api.delete(`/api/auth/my-offers/${id}`);
            setOffers((prev) => prev.filter((offer) => offer.id !== id));
            setSuccessMessage("Offer deleted successfully.");
            setErrorMessage(null);
        } catch {
            setErrorMessage("Failed to delete offer.");
            setSuccessMessage(null);
        }
    };

    const SkeletonCard = () => (
        <div className="bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(255,255,255,0.05)] p-6 animate-pulse flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-800/70 rounded-xl"></div>
                    <div className="h-6 w-32 bg-gray-800/70 rounded"></div>
                </div>
                <div className="h-4 w-20 bg-gray-800/70 rounded-full"></div>
            </div>
            <div className="h-4 w-1/2 bg-gray-800/70 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-800/70 rounded"></div>
            <div className="h-6 w-24 bg-gray-800/70 rounded"></div>
            <div className="h-8 w-28 bg-gray-800/70 rounded self-end"></div>
        </div>
    );

    return (
        <div className="p-6 md:p-10 text-white min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
                My Offers History
            </h1>

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-700/40 border border-red-600 rounded-xl text-red-200 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)]">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 bg-green-700/40 border border-green-600 rounded-xl text-green-200 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)]">
                    {successMessage}
                </div>
            )}

            {isLoading ? (
                <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center mt-20">
                    <div className="w-24 h-24 rounded-full bg-gray-800/70 backdrop-blur-md flex items-center justify-center mb-6 shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(255,255,255,0.05)]">
                        <span className="text-4xl">📝</span>
                    </div>
                    <p className="text-gray-300 italic text-lg">You haven’t made any offers yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Start exploring items and make your first offer!</p>
                </div>
            ) : (
                <div className="relative">
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-700"></div>

                    <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-12">
                        {offers.map((offer, index) => (
                            <div
                                key={offer.id}
                                className={`relative md:w-[90%] ${index % 2 === 0 ? "md:justify-self-end" : "md:justify-self-start"
                                    }`}
                            >
                                <span className="absolute -left-3 md:left-auto md:-ml-3 top-6 w-6 h-6 bg-purple-500 rounded-full border-4 border-gray-900 shadow-[0_4px_12px_rgba(128,0,255,0.6)]"></span>

                                <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(255,255,255,0.05)] p-6 flex flex-col gap-4 hover:shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)] transition transform hover:-translate-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://express-backend-r2by.onrender.com/api/auth/items/${offer.id}/image`}
                                                alt={offer.item_name}
                                                loading="lazy"
                                                className="w-16 h-16 object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = imagePlaceholder;
                                                }}
                                            />
                                            <h3 className="text-lg md:text-xl font-bold text-purple-300">{offer.item_name}</h3>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${offer.status === "accepted"
                                                ? "bg-green-700 text-green-200"
                                                : offer.status === "declined"
                                                    ? "bg-red-700 text-red-200"
                                                    : "bg-yellow-700 text-yellow-200"
                                                }`}
                                        >
                                            {offer.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-400">
                                        Seller: <span className="text-gray-200 font-medium">{offer.seller_name}</span>
                                    </p>

                                    <p className="text-sm text-gray-400">
                                        Offer Price:{" "}
                                        <span className="text-xl md:text-2xl font-semibold text-green-400">
                                            ₱{offer.offer_price}
                                        </span>
                                    </p>

                                    {offer.created_at && (
                                        <p className="text-xs text-gray-500 italic">
                                            Made on{" "}
                                            {new Date(offer.created_at).toLocaleDateString("en-PH", {
                                                timeZone: "Asia/Manila",
                                            })}{" "}
                                            at{" "}
                                            {new Date(offer.created_at).toLocaleTimeString("en-PH", {
                                                timeZone: "Asia/Manila",
                                            })}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => deleteOffer(offer.id)}
                                        className="mt-4 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out bg-linear-to-r from-red-600 to-pink-600 text-white shadow hover:shadow-red-500/40 hover:scale-105 self-start md:self-end"
                                    >
                                        Delete Offer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};