import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import CameraUploadModal from "./CameraUploadModal";
import axios from "axios";

const UpdateImageCamera = ({
    imageUrl,
    uploadRoute,
    param = {},
    name = "photo",
    height = "h-28",
    width = "w-28",
    label = "Capture Profile Photo",
    onImageSelected,
}) => {
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
    const [uploading, setUploading] = useState(false);

    const handleImageCapture = async (imageDataUrl) => {
        if (!imageDataUrl) return;
        setIsCameraModalOpen(false);
        setUploading(true);

        try {
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            const file = new File([blob], "captured.png", { type: "image/png" });

            // ✅ Case 1: uploadRoute provided → upload via Axios
            if (uploadRoute) {
                const formData = new FormData();
                formData.append(name, file);

                const res = await axios.post(route(uploadRoute, param), formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (res?.data?.success) {
                    setCurrentImageUrl(res.data.profile_photo_url || imageDataUrl);
                } else {
                    console.error("Upload failed: ", res?.data);
                }
            }
            // ✅ Case 2: No route → just pass file back to form
            else {
                if (onImageSelected) onImageSelected(file);
                setCurrentImageUrl(imageDataUrl);
            }
        } catch (err) {
            console.error("Image handling failed:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <CameraUploadModal
                isOpen={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
                onImageCaptured={handleImageCapture}
            />

            <div className="flex items-center gap-1">
                <div className="px-2 py-2 relative">
                    <span
                        className="absolute top-1 right-1 bg-gray-700 text-white hover:bg-gray-500 cursor-pointer rounded-full p-1 z-10"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsCameraModalOpen(true);
                        }}
                        title={label}
                    >
                        <MdOutlineEdit />
                    </span>


                    <img
                        src={currentImageUrl || "/images/placeholder.png"}
                        alt="Captured"
                        className={`${width} ${height} rounded-md object-cover border ${uploading ? "opacity-50 grayscale" : "border-black"
                            }`}
                    />

                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-md z-20">
                            <FaSpinner className="animate-spin text-blue-600 text-3xl" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpdateImageCamera;
