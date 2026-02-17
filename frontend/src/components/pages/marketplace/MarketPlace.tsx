import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import api from "../../../services/api";
import imagePlaceholder from "../../../assets/imagePlaceholder.jpg";

interface Item {
    id: number;
    name: string;
    description: string;
    starting_price: number;
    current_price: number | null;
    img_url: string | null;
    owner_name: string;
    status: boolean | null;
    updated_at: string;
}

export default function Marketplace() {
    const [items, setItems] = useState<Item[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const [offerInput, setOfferInput] = useState<{ [key: number]: number }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState<{ [key: number]: boolean }>({});
    const [userOffers, setUserOffers] = useState<{ [key: number]: number }>({});

    const fetchItems = async () => {
        try {
            setIsLoading(true);

            const res = await api.get("/items", {
                params: { limit: 20, offset: 0 },
            });

            if (Array.isArray(res.data)) {
                setItems(res.data);
                setErrorMessage(null);
            } else {
                setItems([]);
                setErrorMessage("Unexpected response format from server.");
            }
        } catch (err: any) {
            console.error("Error fetching items:", err.message);
            setErrorMessage("Failed to load marketplace items.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        // Optional: auto-refresh every 30s so items stay up-to-date
        const interval = setInterval(fetchItems, 30000);
        return () => clearInterval(interval);
    }, []);

    // Derived filtered items
    const filteredItems = useMemo(() => {
        if (!debouncedQuery.trim()) return items;
        const q = debouncedQuery.toLowerCase();
        return items.filter(
            (item) =>
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.owner_name.toLowerCase().includes(q)
        );
    }, [debouncedQuery, items]);

    // Offer submission
    const makeOffer = async (itemId: number, offerPrice: number) => {
        if (!offerPrice || offerPrice <= 0) {
            setErrorMessage("Please enter a valid offer price.");
            return;
        }
        try {
            setButtonLoading((prev) => ({ ...prev, [itemId]: true }));
            const res = await api.post(`/api/auth/items/${itemId}/offers`, {
                offer_price: offerPrice,
            });

            setUserOffers((prev) => ({
                ...prev,
                [itemId]: res.data.offer_price ?? offerPrice,
            }));

            alert(`Offer submitted: ₱${res.data.offer_price ?? offerPrice}`);
            setOfferInput((prev) => ({ ...prev, [itemId]: 0 }));
            setErrorMessage(null);

            fetchItems();
        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message || "Failed to submit offer. Please try again."
            );
        } finally {
            setButtonLoading((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    return (
        <div className="flex-1 py-8 px-3 mt-10 lg:mt-0 transition-all duration-300 transform text-white bg-linear-to-br from-gray-900 via-black to-gray-800 min-h-screen">
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
                        className="w-full p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg transition"
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-600 text-white rounded-lg shadow">{errorMessage}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-900/40 backdrop-blur-lg rounded-2xl p-6 animate-pulse shadow-[0_8px_20px_rgba(0,0,0,0.4),-8px_-8px_20px_rgba(255,255,255,0.05)]"
                        >
                            <div className="w-full h-44 bg-gray-800/60 rounded-xl mb-4"></div>
                            <div className="h-6 bg-gray-800/60 rounded w-2/3 mb-2"></div>
                            <div className="h-4 bg-gray-800/60 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-800/60 rounded w-1/3 mb-4"></div>
                            <div className="h-10 bg-gray-800/60 rounded"></div>
                        </div>
                    ))
                ) : filteredItems.length === 0 ? (
                    <p className="text-center text-gray-400 col-span-full">No items match your search.</p>
                ) : (
                    filteredItems.map((item) => {
                        const basePrice = item.current_price ?? item.starting_price;
                        return (
                            <div
                                key={item.id}
                                className="bg-gray-900/40 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col shadow-[0_8px_20px_rgba(0,0,0,0.4),-8px_-8px_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(128,0,255,0.4)] transition transform hover:-translate-y-2 hover:scale-[1.02]"
                            >
                                <img
                                    src={`https://express-backend-r2by.onrender.com/api/auth/items/${item.id}/image`}
                                    alt={item.name}
                                    loading="lazy"
                                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = imagePlaceholder;
                                    }}
                                />

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold mb-1 text-purple-300">{item.name}</h3>
                                    <p className="text-gray-200 text-sm mb-2 line-clamp-2">{item.description}</p>
                                    <p className="text-xs text-gray-400 mb-2">Owner: {item.owner_name}</p>

                                    <div className="flex justify-between items-center mb-3">
                                        {userOffers[item.id] ? (
                                            <>
                                                <span className="text-sm text-gray-400">Your Offer:</span>
                                                <span className="text-xl font-bold text-green-400">
                                                    ₱{userOffers[item.id]}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm text-gray-400">Starting: ₱{item.starting_price}</span>
                                                <span className="text-xl font-bold text-green-400">₱{basePrice}</span>
                                            </>
                                        )}
                                    </div>

                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 shadow-md ${item.status ? "bg-red-600 text-white" : "bg-green-600 text-white"
                                            }`}
                                    >
                                        {item.status ? "Sold" : "Taking Offers"}
                                    </span>

                                    {!item.status && (
                                        <div className="mt-auto">
                                            <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 w-full">
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
                                                    className="p-2 w-full text-white/80 rounded-lg border border-gray-600 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                                />
                                                <button
                                                    onClick={() => makeOffer(item.id, offerInput[item.id])}
                                                    disabled={buttonLoading[item.id]}
                                                    className={`px-4 w-full py-2 rounded-lg font-medium transition-all duration-300 ease-in-out ${buttonLoading[item.id]
                                                        ? "bg-gray-600 cursor-not-allowed text-white"
                                                        : "bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/40 hover:scale-105"
                                                        }`}
                                                >
                                                    {buttonLoading[item.id] ? "Processing..." : "Submit Offer"}
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {[1.1, 1.25, 1.5, 1.75, 2].map((multiplier) => (
                                                    <button
                                                        key={multiplier}
                                                        onClick={() =>
                                                            makeOffer(item.id, Math.round(basePrice * multiplier))
                                                        }
                                                        disabled={buttonLoading[item.id]}
                                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${buttonLoading[item.id]
                                                            ? "bg-gray-600 cursor-not-allowed text-white"
                                                            : "bg-gray-800/70 text-white shadow hover:bg-linear-to-r hover:from-purple-600 hover:to-indigo-600 hover:shadow-purple-500/40"
                                                            }`}
                                                    >
                                                        {buttonLoading[item.id] ? "..." : `×${multiplier}`}
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