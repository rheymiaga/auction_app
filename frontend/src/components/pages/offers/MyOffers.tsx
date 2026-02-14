import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../api";

interface MyOffer {
    id: number;
    item_name: string;
    seller_name: string;
    offer_price: number;
    status: string;
}

export const MyOffers = () => {
    const [offers, setOffers] = useState<MyOffer[]>([]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_URL}/api/auth/my-offers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOffers(res.data);
            } catch (err: any) {
                console.error("Error fetching my offers:", err.response?.data || err.message);
            }
        };

        fetchOffers();
    }, []);


    return (
        <div className="p-8 mt-10 lg:mt-0 duration-300 transform transition-all text-white min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800">
            <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
                My Offers
            </h1>

            {offers.length === 0 ? (
                <p className="text-gray-400 italic">You haven’t made any offers yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-purple-500/30 hover:-translate-y-1 transition transform"
                        >
                            {/* Item name */}
                            <h3 className="text-xl font-bold text-purple-300">
                                {offer.item_name}
                            </h3>

                            {/* Seller */}
                            <p className="text-sm text-gray-400">
                                Seller:{" "}
                                <span className="text-gray-200 font-medium">
                                    {offer.seller_name}
                                </span>
                            </p>

                            {/* Price */}
                            <p className="text-sm text-gray-400">
                                Offer Price:{" "}
                                <span className="text-2xl font-semibold text-green-400">
                                    ₱{offer.offer_price}
                                </span>
                            </p>

                            {/* Status */}
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};