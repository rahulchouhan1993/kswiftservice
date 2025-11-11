import { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import axios from "axios";
import { useAlerts } from "./Alerts";
import { FaSpinner } from "react-icons/fa6";
import CameraUploadModal from "./CameraUploadModal";

const SchoolAvatarWithImageUpdate = ({ school }) => {
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [schoolData, setSchoolData] = useState(school);
    const [uploading, setUploading] = useState(false);
    const { successAlert, errorAlert, errorsHandling } = useAlerts();
    
    const handleImageCapture = async (imageDataUrl) => {
        if (!schoolData || !imageDataUrl) return;

        setIsCameraModalOpen(false);
        setUploading(true);

        try {
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            const formData = new FormData();

            formData.append("photo", blob, "logo.png");
            const res = await axios.post(route("superadmin.school.update.logo", {uuid : schoolData?.uuid, type: 'camera'}), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res?.data?.success) {
                setSchoolData((prev) => ({
                    ...prev,
                    logo_url: res?.data?.logo_url,
                }));

                successAlert(res?.data?.message);
            } else {
                errorAlert("Failed to update school logo.");
            }
        } catch (error) {
            if (error.response?.data?.message) {
                errorAlert(error.response.data.message);
            } else {
                errorAlert("Something went wrong while uploading.");
            }

            errorsHandling(error);
        } finally {
            setUploading(false);
        }
    };

    if (!schoolData) return null;

    return (
        <>
            <CameraUploadModal
                isOpen={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
                onImageCaptured={handleImageCapture}
            />

            <div className="flex items-center">
                <div className="pr-3 py-2 relative">
                   <span
                        className="Camera_upload absolute top-1 right-1 border bg-gray-700 text-white dark:text-gray-600 dark:bg-gray-200 hover:bg-gray-500 cursor-pointer dark:hover:bg-gray-300 border-black rounded-full p-0.5 z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCameraModalOpen(true);
                        }}
                    >
                        <MdOutlineEdit />
                    </span>

                    <div className="relative w-12 h-12">
                        {uploading && (
                            <div className="absolute inset-0 z-10 bg-white bg-opacity-50 flex items-center justify-center rounded-md">
                                <FaSpinner className="animate-spin text-gray-700 text-lg" />
                            </div>
                        )}
                        <img
                            src={schoolData?.logo_url}
                            alt="Profile"
                            className={`w-12 h-12 rounded-md object-cover border ${
                                uploading ? "opacity-50 grayscale" : "border-black dark:border-blue-500"
                            }`}
                        />
                    </div>
                </div>
            </div>
        </>
    );

};

export default SchoolAvatarWithImageUpdate;
