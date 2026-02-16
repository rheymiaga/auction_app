import { useEffect, useState } from "react";
import api from "../../../services/api";
import imagePlaceholder from '../../../assets/imagePlaceholder.jpg';
import { FaBoxOpen, FaCoins } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";

interface Item {
    id: number;
    name: string;
    description: string;
    starting_price: number;
    current_price: number | null;
    status: boolean;
    offer_count: number;
    img_url?: string | null;
    ownerId: number;
    offers?: Offer[];
    active_offer_count?: number;
}

interface Offer {
    id: number;
    buyer_name: string;
    offer_price: number;
    status: "pending" | "accepted" | "declined";
    created_at?: string;
}

interface DashboardResponse {
    userId: number;
    items: Item[];
    profit: number;
}

export const Dashboard = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [soldItems, setSoldItems] = useState<number>(0);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
    const [isLoadingOffers, setIsLoadingOffers] = useState(false);
    const [profit, setProfit] = useState<number>(0);

    const fetchDashboard = async () => {
        try {
            setIsLoadingDashboard(true);
            const res = await api.get<DashboardResponse>("/api/auth/dashboard");

            setItems(res.data.items);
            setProfit(res.data.profit);
            const soldCount = res.data.items.filter((i: Item) => i.status === true).length;
            setSoldItems(soldCount);

            setErrorMessage(null);
        } catch (err: any) {
            console.error("Error fetching dashboard:", err.response?.data || err.message);
            setErrorMessage("Failed to load dashboard data.");
        } finally {
            setIsLoadingDashboard(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const viewOffers = async (itemId: number) => {
        try {
            setIsLoadingOffers(true);
            const res = await api.get<Offer[]>(`/api/auth/items/${itemId}/offers`);

            const highestOffersMap = res.data.reduce((acc: Record<string, Offer>, offer) => {
                const key = offer.buyer_name;
                if (!acc[key] || offer.offer_price > acc[key].offer_price) {
                    acc[key] = offer;
                }
                return acc;
            }, {});

            const highestOffers = Object.values(highestOffersMap);

            setOffers(highestOffers);
            setSelectedItem(itemId);
            setErrorMessage(null);
        } catch (err: any) {
            console.error("Error fetching offers:", err.response?.data || err.message);
            setErrorMessage("Failed to fetch offers.");
        } finally {
            setIsLoadingOffers(false);
        }
    };

    const respondToOffer = async (offerId: number, action: "accept" | "decline") => {
        try {
            const res = await api.put(`/api/auth/offers/${offerId}/respond`, { action });
            alert(res.data.message);

            if (action === "accept") {
                setOffers([]);
                setSelectedItem(null);
                await fetchDashboard();
            } else if (action === "decline") {
                if (selectedItem) {
                    const refreshed = await api.get<Offer[]>(`/api/auth/items/${selectedItem}/offers`);
                    setOffers(refreshed.data);
                }
                await fetchDashboard();
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
                {isLoadingDashboard ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl animate-pulse 
          shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)] transition-all duration-300"
                        >
                            <div className="h-6 bg-gray-800/70 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-gray-800/70 rounded w-1/3"></div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl 
        shadow-lg hover:shadow-[0_0_25px_rgba(128,0,255,0.5)] 
        transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]">
                            <p className="text-lg flex items-center font-semibold text-gray-100">
                                <RiAuctionFill className="mr-2" /> Sold Items
                            </p>
                            <p className="text-3xl font-bold text-white">{soldItems}</p>
                        </div>

                        <div className="bg-linear-to-r from-blue-600 to-cyan-600 p-6 rounded-2xl 
        shadow-lg hover:shadow-[0_0_25px_rgba(0,200,255,0.5)] 
        transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]">
                            <p className="text-lg flex items-center font-semibold text-gray-100">
                                <FaBoxOpen className="mr-2" /> Total Items
                            </p>
                            <p className="text-3xl font-bold text-white">{items.length}</p>
                        </div>

                        <div className="bg-linear-to-r from-pink-600 to-red-600 p-6 rounded-2xl 
        shadow-lg hover:shadow-[0_0_25px_rgba(255,0,128,0.5)] 
        transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]">
                            <p className="text-lg flex items-center font-semibold text-gray-100">
                                <FaCoins className="mr-2" /> Profit
                            </p>
                            <p className="text-3xl font-bold text-white">₱{profit}</p>
                        </div>
                    </>
                )}
            </div>

            {
                errorMessage && (
                    <div className="mb-4 p-3 bg-red-600 text-white rounded-lg shadow-md">{errorMessage}</div>
                )
            }

            {/* Item Cards */}
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">My Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoadingDashboard ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-5 animate-pulse 
          shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)] transition-all duration-300"
                        >
                            <div className="w-full h-48 bg-gray-800/70 rounded-xl mb-4"></div>
                            <div className="h-6 bg-gray-800/70 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-800/70 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-800/70 rounded w-1/3 mb-4"></div>
                            <div className="h-10 bg-gray-800/70 rounded"></div>
                        </div>
                    ))
                ) : items.length === 0 ? (
                    <p className="text-gray-400 col-span-full text-center">No items found.</p>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-900/70 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col 
          shadow-lg hover:shadow-[0_0_20px_rgba(128,0,128,0.4)] 
          transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]"
                        >
                            <img
                                src={`https://express-backend-r2by.onrender.com/api/auth/items/${item.id}/image` || imagePlaceholder}
                                alt={item.name}
                                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = imagePlaceholder;
                                }}
                            />
                            <div className="p-5 flex flex-col grow">
                                <h3 className="text-lg font-bold mb-1 text-purple-300">{item.name}</h3>
                                <p className="text-sm text-gray-200 mb-2 line-clamp-2">{item.description}</p>
                                <p className="text-sm text-gray-300">Starting Price: ₱{item.starting_price}</p>
                                <p className="text-sm text-gray-300">
                                    Status:{" "}
                                    <span className={item.status ? "text-green-400" : "text-yellow-400"}>
                                        {item.status ? "Sold" : "Taking Offers"}
                                    </span>{" "}
                                    | Offers: {item.offer_count}
                                </p>
                                {item.current_price && (
                                    <p className="text-sm text-gray-300">Sold Price: ₱{item.current_price}</p>
                                )}

                                {/* Action buttons */}
                                <div className="mt-4 flex justify-around gap-3">
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="flex-1 px-4 py-2 rounded-lg font-semibold 
                bg-linear-to-r from-red-600 to-red-500 text-white 
                shadow-md hover:shadow-[0_0_12px_rgba(255,0,0,0.6)] 
                transition-all duration-300 ease-in-out hover:scale-105"
                                    >
                                        Delete
                                    </button>
                                    {!item.status && (
                                        <button
                                            onClick={() => viewOffers(item.id)}
                                            className="flex-1 px-4 py-2 rounded-lg font-semibold 
                  bg-linear-to-r from-purple-600 to-indigo-600 text-white 
                  shadow-md hover:shadow-[0_0_12px_rgba(128,0,255,0.6)] 
                  transition-all duration-300 ease-in-out hover:scale-105"
                                        >
                                            View Offers
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Offers Modal */}
            {
                selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2">
                        <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl w-full max-w-3xl relative 
                    max-h-[80%] overflow-y-auto flex flex-col 
                    shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.05)]">

                            <div className="sticky top-0 bg-gray-900/60 backdrop-blur-md z-10 p-6 flex items-center justify-between 
                      shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)] rounded-t-2xl">
                                <h2 className="text-2xl font-bold text-purple-300">
                                    Offers for Item {selectedItem}
                                </h2>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full 
                     bg-gray-800/70 backdrop-blur-sm 
                     shadow-[4px_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.05)] 
                     text-gray-300 hover:text-purple-300 transition"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {isLoadingOffers ? (
                                    // Skeleton placeholders
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Array.from({ length: 2 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 animate-pulse 
                           shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)]"
                                            >
                                                <div className="h-6 bg-gray-700/70 rounded w-2/3 mb-3"></div>
                                                <div className="h-4 bg-gray-700/70 rounded w-1/2 mb-2"></div>
                                                <div className="h-4 bg-gray-700/70 rounded w-1/3 mb-4"></div>
                                                <div className="h-10 bg-gray-700/70 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : offers.length === 0 ? (
                                    // Empty state
                                    <div className="flex flex-col items-center justify-center text-center mt-10">
                                        <div className="w-20 h-20 rounded-full bg-gray-800/70 backdrop-blur-md flex items-center justify-center mb-4 
                            shadow-[4px_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.05)]">
                                            <span className="text-3xl">🤝</span>
                                        </div>
                                        <p className="text-gray-200 italic text-lg">No offers yet.</p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            waiting for offers...
                                        </p>
                                    </div>
                                ) : (
                                    // Offers list
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {offers.map((offer: Offer) => (
                                            <div
                                                key={offer.id}
                                                className="bg-gray-800/70 backdrop-blur-md rounded-xl p-5 flex flex-col space-y-3 
                           shadow-[6px_6px_12px_rgba(0,0,0,0.5),-6px_-6px_12px_rgba(255,255,255,0.05)] 
                           hover:shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)] 
                           transition transform hover:-translate-y-1"
                                            >
                                                {/* Header: buyer + status */}
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-purple-300">
                                                        {offer.buyer_name}
                                                    </span>
                                                    <span
                                                        className={`font-medium ${offer.status === "accepted"
                                                            ? "text-green-400"
                                                            : offer.status === "declined"
                                                                ? "text-red-400"
                                                                : "text-yellow-400"
                                                            }`}
                                                    >
                                                        {offer.status.toUpperCase()}
                                                    </span>
                                                </div>

                                                {/* Offer price */}
                                                <p className="text-gray-200 text-sm">
                                                    Offered:{" "}
                                                    <span className="font-bold text-white text-lg">
                                                        ₱{offer.offer_price}
                                                    </span>
                                                </p>

                                                {/* Timestamp */}
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

                                                {/* Action buttons */}
                                                {offer.status === "pending" && (
                                                    <div className="flex gap-3 mt-2">
                                                        <button
                                                            onClick={() => respondToOffer(offer.id, "accept")}
                                                            className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm 
                                 bg-gray-800/70 text-green-400 backdrop-blur-sm
                                 shadow-[0_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.05)] 
                                 hover:shadow-[inset_0_2px_6px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.4)] 
                                 transition"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => respondToOffer(offer.id, "decline")}
                                                            className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm 
                                 bg-gray-800/70 text-red-400 backdrop-blur-sm
                                 shadow-[0_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.05)] 
                                 hover:shadow-[inset_0_2px_6px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.4)] 
                                 transition"
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
                        </div>
                    </div>
                )
            }
        </div >
    );
};