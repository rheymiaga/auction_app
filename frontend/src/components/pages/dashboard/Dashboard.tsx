import { useEffect, useState } from "react";
import api from "../../../services/api";

interface Item {
    id: number;
    name: string;
    description: string;
    starting_price: string;
    current_price: string | null;
    status: boolean;
    offer_count: number;
    img_url?: string | null;
}

interface Offer {
    id: number;
    buyer_name: string;
    offer_price: number;
    status: string;
}

export const Dashboard = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [soldItems, setSoldItems] = useState<number>(0);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/api/auth/dashboard");
                setItems(res.data.items);
                const soldCount = res.data.items.filter((i: Item) => i.status === true).length;
                setSoldItems(soldCount);
            } catch (err: any) {
                console.error("Error fetching dashboard:", err.response?.data || err.message);
                setErrorMessage("Failed to load dashboard data.");
            }
        };
        fetchDashboard();
    }, []);

    const viewOffers = async (itemId: number) => {
        try {
            const res = await api.get(`/api/auth/items/${itemId}/offers`);
            setOffers(res.data);
            setSelectedItem(itemId);
        } catch (err: any) {
            console.error("Error fetching offers:", err.response?.data || err.message);
            setErrorMessage("Failed to fetch offers.");
        }
    };

    const respondToOffer = async (offerId: number, action: "accept" | "decline") => {
        try {
            const res = await api.put(`/api/auth/offers/${offerId}/respond`, { action });
            alert(res.data.message);

            if (selectedItem) {
                const refreshed = await api.get(`/api/auth/items/${selectedItem}/offers`);
                setOffers(refreshed.data);
            }
        } catch (err: any) {
            console.error("Error responding to offer:", err.response?.data || err.message);
            setErrorMessage("Failed to respond to offer.");
        }
    };

    const deleteItem = async (itemId: number) => {
        try {
            await api.delete(`/api/auth/items/${itemId}`);
            setItems((prev) => prev.filter((item) => item.id !== itemId));
            alert("Item deleted successfully.");
        } catch (err: any) {
            console.error("Error deleting item:", err.response?.data || err.message);
            setErrorMessage("Failed to delete item.");
        }
    };


    return (
        <div className="px-6 py-10 mt-10 lg:mt-0 text-white min-h-screen transition-all duration-300 transform bg-linear-to-br from-gray-900 via-black to-gray-800">
            {/* Page Title */}
            <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
                My Dashboard
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-6 rounded-xl shadow-lg hover:shadow-purple-500/40 transition transform hover:-translate-y-1">
                    <p className="text-lg font-semibold">Sold Items</p>
                    <p className="text-3xl font-bold">{soldItems}</p>
                </div>
                <div className="bg-linear-to-r from-blue-600 to-cyan-600 p-6 rounded-xl shadow-lg hover:shadow-blue-500/40 transition transform hover:-translate-y-1">
                    <p className="text-lg font-semibold">Total Items</p>
                    <p className="text-3xl font-bold">{items.length}</p>
                </div>
                <div className="bg-linear-to-r from-green-600 to-emerald-600 p-6 rounded-xl shadow-lg hover:shadow-green-500/40 transition transform hover:-translate-y-1">
                    <p className="text-lg font-semibold">Active Offers</p>
                    <p className="text-3xl font-bold">
                        {items.reduce((sum, item) => sum + item.offer_count, 0)}
                    </p>
                </div>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-600 text-white rounded-lg shadow-md">
                    {errorMessage}
                </div>
            )}

            {/* Item Cards */}
            <h2 className="text-2xl font-semibold mb-6">My Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-purple-500/30 hover:-translate-y-2 transition transform"
                    >
                        <img
                            src={`https://express-backend-r2by.onrender.com/api/auth/items/${item.id}/image`}
                            alt={item.name}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                // fallback if no image exists
                                (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/300x200?text=No+Image";
                            }}
                        />

                        <div className="p-5 flex flex-col grow">
                            <h3 className="text-lg font-bold mb-1 text-purple-300">{item.name}</h3>
                            <p className="text-sm text-gray-300 mb-2 line-clamp-2">{item.description}</p>
                            <p className="text-sm">Starting Price: ₱{item.starting_price}</p>
                            <p className="text-sm">
                                Status:{" "}
                                <span className={item.status ? "text-green-400" : "text-yellow-400"}>
                                    {item.status ? "Sold" : "Taking Offers"}
                                </span>{" "}
                                | Offers: {item.offer_count}
                            </p>
                            {item.current_price && (
                                <p className="text-sm">Sold Price: ₱{item.current_price}</p>
                            )}

                            {/* Action buttons */}
                            <div className="mt-4 flex justify-around gap-3">
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="flex-1 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition font-semibold"
                                >
                                    Delete
                                </button>
                                {!item.status && (
                                    <button
                                        onClick={() => viewOffers(item.id)}
                                        className="flex-1 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition font-semibold"
                                    >
                                        View Offers
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                ))}
            </div>

            {/* Offers Section */}
            {selectedItem && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-purple-300">
                        Offers for Item {selectedItem}
                    </h2>
                    {offers.length === 0 ? (
                        <p className="text-gray-400">No offers yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {offers.map((offer) => (
                                <div
                                    key={offer.id}
                                    className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-5 flex flex-col space-y-3 hover:shadow-purple-500/20 transition"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-purple-300">{offer.buyer_name}</span>
                                        <span
                                            className={
                                                offer.status === "accepted"
                                                    ? "text-green-400 font-medium"
                                                    : offer.status === "declined"
                                                        ? "text-red-400 font-medium"
                                                        : "text-yellow-400 font-medium"
                                            }
                                        >
                                            {offer.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <p className="text-gray-300 text-sm">
                                        Offered:{" "}
                                        <span className="font-bold text-white">₱{offer.offer_price}</span>
                                    </p>

                                    {offer.status === "pending" && (
                                        <div className="flex gap-3 mt-2">
                                            <button
                                                onClick={() => respondToOffer(offer.id, "accept")}
                                                className="flex-1 px-3 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => respondToOffer(offer.id, "decline")}
                                                className="flex-1 px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};