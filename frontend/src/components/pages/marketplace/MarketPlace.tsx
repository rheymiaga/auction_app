import { useEffect, useState } from "react";
import api from "../../../services/api";
import imagePlaceholder from '../../../assets/imagePlaceholder.png'

interface Item {
    id: number;
    name: string;
    description: string;
    starting_price: number;
    current_price: number | null;
    img_url: string | null;
    owner_name: string;
    status: boolean;
    updated_at: string;
}

export default function Marketplace() {
    const [items, setItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [offerInput, setOfferInput] = useState<{ [key: number]: number }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await api.get("/api/auth/items");
                const now = new Date();

                const filtered = res.data.filter((item: Item) => {
                    if (!item.status) return true;
                    const updated = new Date(item.updated_at);
                    const diffMs = now.getTime() - updated.getTime();
                    return diffMs < 60 * 60 * 1000;
                });

                setItems(filtered);
                setFilteredItems(filtered);
            } catch (err: any) {
                setErrorMessage("Failed to load marketplace items.");
            }
        };

        fetchItems();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredItems(items);
        } else {
            const q = searchQuery.toLowerCase();
            setFilteredItems(
                items.filter(
                    (item) =>
                        item.name.toLowerCase().includes(q) ||
                        item.description.toLowerCase().includes(q) ||
                        item.owner_name.toLowerCase().includes(q)
                )
            );
        }
    }, [searchQuery, items]);

    const makeOffer = async (itemId: number, offerPrice: number) => {
        if (!offerPrice || offerPrice <= 0) {
            setErrorMessage("Please enter a valid offer price.");
            return;
        }
        try {
            const res = await api.post(`/api/auth/items/${itemId}/offers`, {
                offer_price: offerPrice,
            });

            alert(`Offer submitted: ₱${res.data.offer_price}`);
            setOfferInput((prev) => ({ ...prev, [itemId]: 0 }));
            setErrorMessage(null);
        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message || "Failed to submit offer. Please try again."
            );
        }
    };

    return (
        <div className="flex-1 p-8 mt-10 lg:mt-0 transition-all duration-300 transform text-white bg-linear-to-br from-gray-900 via-black to-gray-800 min-h-screen">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-700 pb-4">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
                    Marketplace
                </h2>
                <div className="w-full md:w-1/2 lg:w-1/3">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 
        focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg transition"
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-600 text-white rounded-lg shadow">
                    {errorMessage}
                </div>
            )}

            {/* Item Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredItems.length === 0 ? (
                    <p className="text-center text-gray-400 col-span-full">
                        No items match your search.
                    </p>
                ) : (
                    filteredItems.map((item) => {
                        const basePrice = item.current_price ?? item.starting_price;
                        return (
                            <div
                                key={item.id}
                                className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-purple-500/40 
          transition transform hover:-translate-y-2 overflow-hidden flex flex-col border border-gray-700"
                            >
                                import imagePlaceholder from "../../../assets/imagePlaceholder.png";

                                <img
                                    src={`https://express-backend-r2by.onrender.com/api/auth/items/${item.id}/image`}
                                    alt={item.name}
                                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = imagePlaceholder;
                                    }}
                                />

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold mb-1 text-purple-300">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                                        {item.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Owner: {item.owner_name}
                                    </p>

                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-gray-400">
                                            Starting: ₱{item.starting_price}
                                        </span>
                                        <span className="text-xl font-bold text-purple-400">
                                            ₱{basePrice}
                                        </span>
                                    </div>

                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 shadow-md ${item.status ? "bg-red-600 text-white" : "bg-green-600 text-white"
                                            }`}
                                    >
                                        {item.status ? "Sold" : "Taking Offers"}
                                    </span>

                                    {!item.status && (
                                        <div className="mt-auto">
                                            <div className="flex items-center gap-2 mb-3 w-full justify-between">
                                                <input
                                                    type="number"
                                                    placeholder="Enter your offer"
                                                    value={offerInput[item.id] ?? ""}
                                                    onChange={(e) =>
                                                        setOfferInput({
                                                            ...offerInput,
                                                            [item.id]: Number(e.target.value),
                                                        })
                                                    }
                                                    className="p-2 text-white/80 rounded-lg border border-gray-600 bg-gray-900 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                                />
                                                <button
                                                    onClick={() => makeOffer(item.id, offerInput[item.id])}
                                                    className="px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 
                    rounded-lg hover:scale-105 transition font-medium shadow-lg"
                                                >
                                                    Submit Offer
                                                </button>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                {[1.1, 1.25, 1.5, 1.75, 2].map((multiplier) => (
                                                    <button
                                                        key={multiplier}
                                                        onClick={() =>
                                                            makeOffer(item.id, Math.round(basePrice * multiplier))
                                                        }
                                                        className="px-3 py-1 bg-gray-700 rounded-full hover:bg-purple-600 
                      transition text-sm shadow"
                                                    >
                                                        ×{multiplier}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
}