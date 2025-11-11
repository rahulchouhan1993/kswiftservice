import React, { useState } from "react";

const AttachedImagePopup = ({ images, onClose, onSave }) => {
    const [selectedImages, setSelectedImages] = useState({});

    const handleFileChange = (e, name) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImages((prev) => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(selectedImages);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[999] flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Attach Custom Images</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {images.map((img) => (
                        <div key={img.name} className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{img.name}</span>
                            <input
                                type="file"
                                accept="image/*"
                                disabled={img.name === "Profile_pic"}
                                onChange={(e) => handleFileChange(e, img.name)}
                                className={`border rounded px-2 py-1 ${img.name === "Profile_pic" ? "opacity-50 cursor-not-allowed" : ""}`}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
};

export default AttachedImagePopup;
