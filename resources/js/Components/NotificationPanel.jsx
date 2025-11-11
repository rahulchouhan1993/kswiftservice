import React from "react";
import { FaBell } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function NotificationPanel({ isOpen, onClose, notifications = [] }) {
  return (
    <div
      className={`fixed top-[56px]  right-0 h-full w-full sm:max-w-sm bg-white dark:bg-[#131836] shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b dark:border-blue-900 border-gray-300">
        <h2 className="text-lg font-bold dark:text-white text-gray-800 flex items-center gap-2"><FaBell />Notifications</h2>
        <button onClick={onClose} className="text-2xl text-gray-600 dark:text-white hover:text-red-500">
          <IoClose />
        </button>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No notifications</p>
        ) : (
          notifications.map((note, index) => (
            <div key={index} className="p-3 rounded-md bg-gray-100 dark:bg-blue-950 text-sm text-gray-800 dark:text-white">
              {note}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
