import { useEffect, useState } from "react";
import api from "../../../services/api";

interface MyOffer {
    id: number;
    item_name: string;
    seller_name: string;
    offer_price: number;
    status: string;
    created_at?: string;
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
            } catch (err: any) {
                console.error("Error fetching my offers:", err.response?.data || err.message);
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
        } catch (err: any) {
            console.error("Error deleting offer:", err.response?.data || err.message);
            setErrorMessage("Failed to delete offer.");
            setSuccessMessage(null);
        }
    };

    // Enhanced Skeleton card for loading state
    const SkeletonCard = () => (
        <div className="relative bg-gray-800/40 border border-gray-700 rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-6 w-2/3 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-1/4 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 w-28 bg-gray-700 rounded md:justify-self-end"></div>
        </div>
    );

    return (
        <div className="p-6 md:p-10 text-white min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
                My Offers History
            </h1>

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-700/50 border border-red-600 rounded-lg text-red-200">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 bg-green-700/50 border border-green-600 rounded-lg text-green-200">
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
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-6">
                        <span className="text-4xl">📝</span>
                    </div>
                    <p className="text-gray-400 italic text-lg">
                        You haven’t made any offers yet.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Start exploring items and make your first offer!
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-700"></div>

                    <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-12">
                        {offers.map((offer, index) => (
                            <div
                                key={offer.id}
                                className={`relative md:w-[90%] ${index % 2 === 0 ? "md:justify-self-end" : "md:justify-self-start"
                                    }`}
                            >
                                {/* Timeline dot */}
                                <span className="absolute -left-3 md:left-auto md:-ml-3 top-6 w-6 h-6 bg-purple-500 rounded-full border-4 border-gray-900"></span>

                                {/* Card */}
                                <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-purple-500/30 transition transform hover:-translate-y-1">
                                    <h3 className="text-lg md:text-xl font-bold text-purple-300">
                                        {offer.item_name}
                                    </h3>

                                    <p className="text-sm text-gray-400">
                                        Seller:{" "}
                                        <span className="text-gray-200 font-medium">{offer.seller_name}</span>
                                    </p>

                                    <p className="text-sm text-gray-400">
                                        Offer Price:{" "}
                                        <span className="text-xl md:text-2xl font-semibold text-green-400">
                                            ₱{offer.offer_price}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-400">
                                        Status:{" "}
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
                                    </p>

                                    {offer.created_at && (
                                        <p className="text-xs text-gray-500 italic">
                                            Made on {new Date(offer.created_at).toLocaleDateString()} at{" "}
                                            {new Date(offer.created_at).toLocaleTimeString()}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => deleteOffer(offer.id)}
                                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition self-start md:self-end"
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