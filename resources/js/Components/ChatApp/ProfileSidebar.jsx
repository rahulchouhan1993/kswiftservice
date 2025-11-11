import { motion, AnimatePresence } from "framer-motion";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiImageEditFill } from "react-icons/ri";
import { useState } from "react";
import { FaFacebookSquare, FaInstagramSquare, FaLink, FaLinkedin, FaTwitterSquare, FaWhatsappSquare } from "react-icons/fa";
import EditProfileModal from "./EditProfileModal";

export default function ProfileSidebar({ isOpen, setIsOpen }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSaveProfile = (updatedData) => {
        setUser(updatedData);
    };

    const [user, setUser] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        bio: "Building awesome web experiences.",
        location: "San Francisco, CA",
        phonenumber: "123-456-7890",
        avatar: "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
        instagram: "https://instagram.com/johndoe",
        facebook: "https://facebook.com/johndoe",
        twitter: "https://twitter.com/jsdjbsdkfgsdk",
        linkedin: "https://linkedin.com/in/johndoe",
        whatsapp: "https://wa.me/1234567890"
    });

    // for image uploading
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prevUser) => ({
                    ...prevUser,
                    avatar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const getUsernameFromUrl = (url) => {
        try {
            const parts = url.split('/');
            let username = parts[parts.length - 1] || parts[parts.length - 2];
            if (username.includes('?')) username = username.split('?')[0]; // handle query params
            return username;
        } catch {
            return url;
        }
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-[0px] left-0 h-full w-64 md:w-80 bg-white dark:bg-[#131836] shadow-2xl z-50 flex flex-col sm:p-6 p-2 border dark:border-r-blue-900 "
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"> <FaRegCircleUser className="h-5 w-5 text-green-600" />Profile</h2>
                        <button onClick={() => setIsOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition">
                            <IoClose size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="h-auto w-full flex items-center justify-center relative px-[20px]">
                            <label
                                htmlFor="profile-upload"
                                className="cursor-pointer relative inline-block w-[178px] h-[178px]  rounded-full p-[5px] border-[5px] border-purple-500"
                            >
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full "
                                />

                                {/* Top-right icon overlay */}
                                <div className="absolute top-[5px] right-[5px] flex items-start justify-end p-1">
                                    <span className="text-white bg-black bg-opacity-60 rounded-full p-1">
                                        <RiImageEditFill className="w-5 h-5" />
                                    </span>
                                </div>
                            </label>


                            <input
                                id="profile-upload"
                                name="profile_photo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />

                        </div>

                        {/* For edit button-- */}
                        <div
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 text-sm border dark:border-black border-white rounded-lg bg-blue-500 text-white font-bold -translate-y-3 cursor-pointer hover:bg-blue-700"
                        >
                            Edit
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{user.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 italic">{user.phonenumber}</p>
                            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 italic">{user.bio}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📍 {user.location}</p>
                        </div>


                        {/* Social Links: */}
                        <div className="mt-8 w-full px-4 ">
                            <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2 mb-4">
                                <FaLink /> Your Social Links
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href={user.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 text-lg text-gray-800 dark:text-gray-200 hover:underline"
                                    >
                                        <FaInstagramSquare className="h-[25px] w-[25px] text-pink-500" />
                                        {getUsernameFromUrl(user.instagram)}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={user.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 text-lg text-gray-800 dark:text-gray-200 hover:underline"
                                    >
                                        <FaTwitterSquare className="h-[25px] w-[25px] text-sky-500" />
                                        {getUsernameFromUrl(user.twitter)}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={user.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 text-lg text-gray-800 dark:text-gray-200 hover:underline"
                                    >
                                        <FaLinkedin className="h-[25px] w-[25px] text-blue-700" />
                                        {getUsernameFromUrl(user.linkedin)}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={user.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 text-lg text-gray-800 dark:text-gray-200 hover:underline"
                                    >
                                        <FaFacebookSquare className="h-[25px] w-[25px] text-blue-600" />
                                        {getUsernameFromUrl(user.facebook)}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={user.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 text-lg text-gray-800 dark:text-gray-200 hover:underline"
                                    >
                                        <FaWhatsappSquare className="h-[25px] w-[25px] text-green-500" />
                                        {getUsernameFromUrl(user.whatsapp)}
                                    </a>
                                </li>
                            </ul>

                        </div>
                    </div>

                </motion.div>
            )}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onSave={handleSaveProfile}
            />

        </AnimatePresence>
    );
}
