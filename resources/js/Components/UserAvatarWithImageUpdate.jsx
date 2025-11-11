import { useState } from "react";
import CameraUploadModal from "./CameraUploadModal";
import { MdOutlineEdit } from "react-icons/md";
import axios from "axios";
import { router } from "@inertiajs/react";
import { useAlerts } from "./Alerts";
import { FaSpinner } from "react-icons/fa6";

const UserAvatarWithImageUpdate = ({ student }) => {
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [studentData, setStudentData] = useState(student);
    const [uploading, setUploading] = useState(false);
    const { successAlert, errorAlert, errorsHandling } = useAlerts();
    

    const handleImageCapture = async (imageDataUrl) => {
        if (!studentData || !imageDataUrl) return;

        setIsCameraModalOpen(false);
        setUploading(true);

        try {
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();

            if (!blob || blob.size === 0) {
                throw new Error("Captured image is empty");
            }

            const file = new File([blob], "captured.png", { type: blob.type || "image/png" });

            const formData = new FormData();
            formData.append("photo", file);

            const res = await axios.post(
                route("school.management.student.update.photo", {
                    uuid: studentData?.uuid,
                    type: "camera",
                }),
                formData,
                {
                    headers: {
                        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                        "Accept": "application/json",
                    },
                }
            );

            if (res?.data?.success) {
                setStudentData((prev) => ({
                    ...prev,
                    profile_photo_url: res?.data?.profile_photo_url,
                }));
                successAlert(res?.data?.message);
            } else {
                errorAlert("Failed to update profile photo.");
            }
        } catch (error) {
            errorAlert(error.response?.data?.message || "Something went wrong while uploading.");
        } finally {
            setUploading(false);
        }
    };



    if (!studentData) return null;

    return (
        <>
            <CameraUploadModal
                isOpen={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
                onImageCaptured={handleImageCapture}
            />

            <div className="flex items-center w-[250px] gap-1">
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
                            src={studentData?.profile_photo_url}
                            alt="Profile"
                            className={`w-12 h-12 rounded-md object-cover border ${
                                uploading ? "opacity-50 grayscale" : "border-black dark:border-blue-500"
                            }`}
                        />
                    </div>
                </div>

                {/* <a href={route('school.management.student.info', {uuid: studentData?.uuid})}> */}
                    <div className="flex flex-col space-y-1">
                        <p className="text-xs sm:text-md text-gray-900 dark:text-white text-left">
                            {studentData?.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 text-xs  text-gray-600 dark:text-gray-400 mt-0.5">
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Reg. No:</span>
                                <span>{studentData?.reg_no ?? "--"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Roll No:</span>
                                <span>{studentData?.roll_no ?? "--"}</span>
                            </div>
                        </div>
                    </div>
                {/* </a> */}
            </div>
        </>
    );
};

export default UserAvatarWithImageUpdate;
