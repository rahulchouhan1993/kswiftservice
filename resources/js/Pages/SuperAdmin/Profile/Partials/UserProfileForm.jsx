import { MdEmail, MdVerified, MdOutlinePhone, MdWhatsapp, MdOutlineSecurity, MdDeleteForever } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';
import { BsShieldFillCheck, BsShieldSlash } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';
import { GoUnverified } from "react-icons/go";
import { useState } from 'react';

export default function UserProfileCard({ userData }) {
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const user = {
        name: userData?.name,
        email: userData?.email,
        emailVerified: true,
        phone: userData?.phone,
        whatsapp: userData?.whatsapp_number,
        role: 'SuperAdmin',
        createdAt: new Date(userData?.created_at),
        updatedAt: new Date(userData?.updated_at),
    };

    return (
        <div className="w-full bg-gray-100 dark:bg-blue-950 rounded-xl flex flex-col items-start gap-6 transition-all duration-300">
            <div className="w-full">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">All information about your profile is shown below.</p>
            </div>

            <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between ">
                <div className="flex-1 w-full space-y-2 md:px-8 text-gray-800 dark:text-gray-100">
                    <div className="flex items-center justify-between bg-gray-200 dark:bg-[#131836] rounded-lg px-4 py-2 shadow-sm">
                        <div className="flex items-center gap-3 text-lg md:text-2xl font-semibold">
                            <FaUserAlt className="text-blue-600 dark:text-blue-400" />
                            <span>{user.name}</span>
                        </div>
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
                            {user.role}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-200 dark:bg-[#131836] rounded-lg px-4 py-2 shadow-sm">
                        <MdEmail className="text-blue-600 dark:text-blue-400 text-lg md:text-2xl" />
                        <span className="truncate">{user.email}</span>
                        {user.emailVerified ? (
                            <MdVerified className="text-green-500" title="Verified Email" />
                        ) : (
                            <GoUnverified className="text-red-400" title="Unverified Email" />
                        )}
                    </div>

                    <div className="flex items-center gap-3 bg-gray-200 dark:bg-[#131836] rounded-lg px-4 py-2 shadow-sm">
                        <MdOutlinePhone className="text-blue-600 dark:text-blue-400 text-lg md:text-2xl" />
                        <span>{user.phone}</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-200 dark:bg-[#131836] rounded-lg px-4 py-2 shadow-sm">
                        <MdWhatsapp className="text-green-600 text-lg md:text-2xl" />
                        <span>{user.whatsapp}</span>
                    </div>

                    <div className="flex justify-between items-center bg-gray-200 dark:bg-[#131836] text-xs md:text-sm text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg shadow-sm">

                        <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Created:</span>
                            <span>{formatDistanceToNow(user.createdAt)} ago</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Updated:</span>
                            <span>{formatDistanceToNow(user.updatedAt)} ago</span>
                        </div>

                    </div>



                </div>
            </div>
        </div>
    );
}
