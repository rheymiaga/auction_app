import { useState } from "react";
import api from "../../../services/api";

export const ItemForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startingPrice, setStartingPrice] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("starting_price", startingPrice);
            if (imageFile) {
                formData.append("image", imageFile);
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
        }
    };



    return (
        <div className="min-h-screen mt-10 lg:mt-0 transform transition-all duration-300 w-full flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800 p-6">
            <form
                onSubmit={handleSubmit}
                className="max-w-5xl w-full mx-auto bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-10 text-white"
            >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 mb-8 text-center">
                    Add New Item
                </h2>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Left: Image Upload */}
                    <div className="flex-1 flex flex-col items-center">
                        <label className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 hover:border-purple-500 transition">
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
                                    className="w-56 h-56 object-cover rounded-lg mt-2 shadow-lg hover:scale-105 transition"
                                />
                            ) : (
                                <div className="w-56 h-56 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
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
                                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Description</label>
                            <textarea
                                placeholder="Enter product description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Starting Price (₱)</label>
                            <input
                                type="number"
                                placeholder="₱ Enter price"
                                value={startingPrice}
                                onChange={(e) => setStartingPrice(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transform transition duration-300 ease-in-out"
                        >
                            Post to Marketplace
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};