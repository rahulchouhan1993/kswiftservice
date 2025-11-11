import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import PrimaryButton from "../PrimaryButton";
import { FaFacebookSquare, FaInstagramSquare, FaLinkedin, FaTwitterSquare, FaWhatsappSquare } from "react-icons/fa";

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
    const [formData, setFormData] = useState(user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white dark:bg-[#0a0e25] rounded-lg shadow-lg w-full max-w-2xl p-6 border dark:border-blue-900"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Edit Profile</h2>
                            <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition">
                                <IoClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                    required
                                />

                                <input
                                    type="text"
                                    name="phonenumber"
                                    value={formData.phonenumber}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                />

                            </div>


                            <div>
                                <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Bio"
                                className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                rows={2}
                            />
                            </div>


                            <div className="flex flex-col items-center justify-start w-full">
                                {/* <p className="my-2">Social Links</p> */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div>
                                        <label htmlFor="instagram" className="flex items-center gap-2"><FaInstagramSquare className="text-pink-500" />Instagram</label>
                                        <input
                                            type="text"
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                            placeholder="Instagram"
                                            className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="twitter" className="flex items-center gap-2"><FaTwitterSquare className="text-sky-500" />Twitter</label>
                                        <input
                                            type="text"
                                            name="twitter"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                            placeholder="Twitter"
                                            className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="linkedin" className="flex items-center gap-2" ><FaLinkedin className="text-blue-700" />LinkedIn</label>
                                        <input
                                            type="text"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            placeholder="LinkedIn"
                                            className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                        />
                                    </div>
                                    <div >
                                        <label htmlFor="facebook" className="flex items-center gap-2" ><FaFacebookSquare className="text-blue-600" />Facebook</label>
                                        <input
                                            type="text"
                                            name="facebook"
                                            value={formData.facebook}
                                            onChange={handleChange}
                                            placeholder="Facebook"
                                            className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 w-full ">
                                    <label htmlFor="whatsapp" className="flex items-center gap-2"><FaWhatsappSquare className="text-green-500" />What's App Number</label>
                                    <input
                                        type="text"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        placeholder="What's App Number"
                                        className="w-full p-2 rounded border dark:bg-[#131836] dark:border-blue-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <PrimaryButton
                                type="submit"
                                className="w-full justify-center py-2 px-4"
                            >
                                Save Changes
                            </PrimaryButton>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
