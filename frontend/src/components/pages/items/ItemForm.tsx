import { useState, useEffect } from "react";
import api from "../../../services/api";

export const ItemForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startingPrice, setStartingPrice] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("starting_price", startingPrice);

            if (imageFile) {
                formData.append("image", imageFile);
                formData.append("image_mime", imageFile.type);
            }

            const res = await api.post("/api/auth/items", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Item posted successfully!");
            console.log(res.data);

            setName("");
            setDescription("");
            setStartingPrice("");
            setImageFile(null);
            setPreview(null);
        } catch (err: any) {
            console.error("Error posting item:", err.response?.data || err.message);
            alert("Failed to post item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-10 lg:mt-0 flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800 px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="max-w-5xl w-full mx-auto bg-gray-900 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.05)] p-10 text-white"
            >
                <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 mb-8">
                    Add New Item
                </h2>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Left: Image Upload */}
                    <div className="flex-1 flex flex-col items-center">
                        <label className="w-full cursor-pointer flex flex-col items-center justify-center rounded-xl p-6 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] bg-gray-900 transition">
                            <span className="text-gray-400 mb-2">Upload product image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-56 h-56 object-cover rounded-lg mt-2 shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-56 h-56 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]">
                                    No Image
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Right: Form Fields */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Product Name</label>
                            <input
                                type="text"
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Description</label>
                            <textarea
                                placeholder="Enter product description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Starting Price (₱)</label>
                            <input
                                type="number"
                                placeholder="₱ Enter price"
                                value={startingPrice}
                                onChange={(e) => setStartingPrice(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-semibold transform transition duration-300 ease-in-out ${loading
                                    ? "bg-gray-600 cursor-not-allowed shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
                                    : "bg-gray-900 shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(255,255,255,0.05)] hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] hover:scale-105"
                                }`}
                        >
                            {loading ? "Posting..." : "Post to Marketplace"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};