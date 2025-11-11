import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaBell, FaMoon, FaPalette } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

export default function SettingsSidebar({ isOpen, setIsOpen }) {
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        themeColor: "blue"
    });

    const handleToggle = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleThemeChange = (e) => {
        setSettings((prev) => ({
            ...prev,
            themeColor: e.target.value
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-[0px]  left-0 h-full w-64 md:w-80 bg-white dark:bg-[#131836] shadow-2xl z-50 flex flex-col sm:p-6 p-2 border dark:border-r-blue-900"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"><CiSettings className="h-5 w-5 text-purple-600" />Settings</h2>
                        <button onClick={() => setIsOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition">
                            <IoClose size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaBell className="text-yellow-500" />
                                <span className="text-gray-800 dark:text-gray-200">Notifications</span>
                            </div>
                            <button
                                onClick={() => handleToggle("notifications")}
                                className={`px-2 py-1 rounded ${settings.notifications ? "bg-green-500 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
                            >
                                {settings.notifications ? "On" : "Off"}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaMoon className="text-purple-500" />
                                <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
                            </div>
                            <button
                                onClick={() => handleToggle("darkMode")}
                                className={`px-2 py-1 rounded ${settings.darkMode ? "bg-green-500 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
                            >
                                {settings.darkMode ? "On" : "Off"}
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <FaPalette className="text-pink-500" />
                                <span className="text-gray-800 dark:text-gray-200">Theme Color</span>
                            </div>
                            <select
                                value={settings.themeColor}
                                onChange={handleThemeChange}
                                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            >
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                                <option value="green">Green</option>
                                <option value="pink">Pink</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="mt-8 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold transition"
                    >
                        Save & Close
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
