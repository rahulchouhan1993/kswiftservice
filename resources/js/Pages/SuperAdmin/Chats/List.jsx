import { Head, usePage, router } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
    FiSmile,
    FiPaperclip,
    FiSearch,
    FiMenu,
} from "react-icons/fi";
import { BsCheck2All } from "react-icons/bs";
import { TbDialpad } from "react-icons/tb";
import HoverMessageTooltip from "@/Components/ChatApp/HoverMessageTooltip";
import ProfileSidebar from "@/Components/ChatApp/ProfileSidebar";
import { IoSend } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { FaCircle, FaEllipsisV } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import NavLink from "@/Components/NavLink";
import SettingsSidebar from "@/Components/ChatApp/SettingsSidebar";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";

const DEFAULT_AVATAR =
    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg";

export default function List() {
    /** ------------------------------------------------------------------
     * PROPS FROM BACKEND
     * ------------------------------------------------------------------ */
    const { messages: backendMessages, otherBookings, auth } = usePage().props;

    const currentUserName = auth?.user?.name;

    /** ------------------------------------------------------------------
     * FORMAT MESSAGES FOR YOUR UI (LEFT/RIGHT FIXED)
     * ------------------------------------------------------------------ */
    const messages = Array.isArray(backendMessages)
        ? backendMessages.map((msg, index) => {
            const isCustomer = msg.sender_role === "customer";

            return {
                id: index,
                side: isCustomer ? "left" : "right",      // LEFT = customer | RIGHT = mechanic
                bubble: isCustomer ? "blue" : "pink",      // blue for customer, pink for mechanic
                showAvatar: isCustomer,                    // avatar only for customer
                author: msg.from,
                content: msg.message,
                timestamp: new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
        })
        : [];

    const [searchBooking, setSearchBooking] = useState("");
    const chatUsers = Array.isArray(otherBookings)
        ? otherBookings
            .filter((b) =>
                `${b.vehicle_make} ${b.vehicle_number}`
                    .toLowerCase()
                    .includes(searchBooking.toLowerCase())
            )
            .map((b) => ({
                id: b.booking_id,
                name: `${b.vehicle_make} - ${b.vehicle_number}`,
                avatar: DEFAULT_AVATAR,
                lastMessage: "",
                timestamp: b.booking_date,
                isOnline: true,
                uuid: b.uuid,
            }))
        : [];


    /** ------------------------------------------------------------------
     * EXISTING STATES (UNCHANGED)
     * ------------------------------------------------------------------ */
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const emojiPickerRef = useRef(null);

    /** IMAGE HANDLERS */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            id: Date.now() + Math.random(),
            url: URL.createObjectURL(file),
            file,
        }));
        setSelectedImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (id) => {
        setSelectedImages((prev) => {
            const img = prev.find((x) => x.id === id);
            if (img) URL.revokeObjectURL(img.url);
            return prev.filter((x) => x.id !== id);
        });
    };

    /** EMOJI PICKER & SIDEBAR HANDLERS */
    useEffect(() => {
        const closeOnEsc = (e) => {
            if (e.key === "Escape") {
                setShowSidebar(false);
                setShowEmojiPicker(false);
            }
        };

        const closeOnClickOutside = (e) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(e.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        window.addEventListener("keydown", closeOnEsc);
        document.addEventListener("mousedown", closeOnClickOutside);

        return () => {
            window.removeEventListener("keydown", closeOnEsc);
            document.removeEventListener("mousedown", closeOnClickOutside);
            selectedImages.forEach((img) => URL.revokeObjectURL(img.url));
        };
    }, [selectedImages]);

    /** ------------------------------------------------------------------
     * UI SECTION — NO DESIGN CHANGE BELOW
     * ------------------------------------------------------------------ */
    return (
        <AuthenticatedLayout>
            <Head title="Booking Chats" />

            <div className="pt-[56px] w-full h-screen">
                <div className="w-full h-full">
                    <div className="flex bg-gray-100 dark:bg-[#131836] h-full relative text-gray-900 dark:text-white">

                        {/* Hamburger */}
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="md:hidden absolute top-2 left-3 bg-gray-200 dark:bg-[#131836] rounded-full p-1 z-50"
                        >
                            <FiMenu className="text-[20px]" />
                        </button>

                        {/* Overlay */}
                        {showSidebar && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                                onClick={() => setShowSidebar(false)}
                            ></div>
                        )}

                        {/* LEFT SIDEBAR */}
                        <div
                            className={`
                                fixed md:static top-[56px] left-0 h-full w-64 md:w-80
                                bg-white dark:bg-[#131836]
                                border-r border-gray-200 dark:border-slate-700
                                flex flex-col z-50
                                transition-transform duration-300
                                ${showSidebar
                                    ? "translate-x-0"
                                    : "-translate-x-full md:translate-x-0"
                                }
                            `}
                        >
                            {/* User Header */}
                            <div className="sm:px-3 pr-3 py-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={DEFAULT_AVATAR}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <span className="font-medium">
                                            {auth?.user?.name}
                                        </span>
                                    </div>

                                    <HoverMessageTooltip
                                        trigger={
                                            <FaEllipsisV className="text-gray-600 dark:text-gray-300 cursor-pointer" />
                                        }
                                        messages={[
                                            <button
                                                onClick={() => setIsOpen(true)}
                                                className="px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-[#0a0e25]"
                                            >
                                                <FaRegCircleUser /> Profile
                                            </button>,
                                            <button
                                                onClick={() =>
                                                    setIsSettingsOpen(true)
                                                }
                                                className="px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-[#0a0e25]"
                                            >
                                                <CiSettings /> Settings
                                            </button>,
                                            <NavLink
                                                href={route("superadmin.logout")}
                                                method="post"
                                                as="button"
                                                className="px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-[#0a0e25]"
                                            >
                                                <IoMdLogOut /> Logout
                                            </NavLink>,
                                        ]}
                                        position="left"
                                    />

                                    <ProfileSidebar
                                        isOpen={isOpen}
                                        setIsOpen={setIsOpen}
                                    />

                                    <SettingsSidebar
                                        isOpen={isSettingsOpen}
                                        setIsOpen={setIsSettingsOpen}
                                    />
                                </div>
                            </div>

                            {/* Search */}
                            <div className="sm:p-2 px-1">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search bookings..."
                                        value={searchBooking}
                                        onChange={(e) => setSearchBooking(e.target.value)}
                                        className="w-full pl-9 bg-gray-100 dark:bg-[#131836] border rounded-lg text-sm"
                                    />

                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <TbDialpad />
                                    </button>
                                </div>
                            </div>

                            {/* Dynamic Chat Users */}
                            <div className="overflow-y-auto">
                                <div className="sm:px-1 py-2">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase ml-1 mb-2">
                                        Recent Bookings
                                    </h3>

                                    <div className="space-y-1">
                                        {chatUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            "superadmin.booking.chat.list",
                                                            { uuid: user.uuid }
                                                        )
                                                    )
                                                }
                                                className="flex items-center gap-3 sm:px-3 px-1 py-2 hover:bg-gray-100 dark:hover:bg-[#0a0e25] rounded-lg cursor-pointer"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={user.avatar}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between">
                                                        <p className="font-medium truncate">
                                                            {user.name}
                                                        </p>
                                                        <span className="text-xs text-gray-500">
                                                            {user.timestamp}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {user.lastMessage}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CHAT WINDOW */}
                        <div className="flex-1 flex flex-col">
                            {/* Header */}
                            <div className="bg-white dark:bg-[#131836] border-b px-2 sm:py-3">
                                <h1 className="text-md md:text-xl font-semibold ml-[40px] sm:ml-[55px] md:ml-0">
                                    Chat
                                </h1>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="flex justify-center items-center h-full">
                                        <p className="text-red-500 dark:text-red-400 text-lg">
                                            No conversation in this booking
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.side === "right" ? "flex-row-reverse space-x-reverse" : ""
                                                    }`}
                                            >
                                                {/* Avatar only for customer */}
                                                {msg.showAvatar && (
                                                    <img
                                                        src={DEFAULT_AVATAR}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                )}

                                                <div className="flex flex-col">
                                                    <div
                                                        className={`px-4 py-2 rounded-2xl ${msg.bubble === "pink"
                                                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                                            : "bg-blue-500 text-white"
                                                            }`}
                                                    >
                                                        <p className="text-sm">{msg.content}</p>
                                                    </div>

                                                    <div
                                                        className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${msg.side === "right" ? "justify-end" : "justify-start"
                                                            }`}
                                                    >
                                                        {msg.author}, {msg.timestamp}
                                                        <BsCheck2All />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>


                            {/* Input Section */}
                            <div className="px-1 pt-1 sm:px-3 sm:p-2 bg-white dark:bg-[#131836] border-t">
                                {showEmojiPicker && (
                                    <div
                                        ref={emojiPickerRef}
                                        className="absolute bottom-[60px] left-10 z-50"
                                    >
                                        <Picker
                                            data={data}
                                            theme={
                                                document.documentElement.classList.contains(
                                                    "dark"
                                                )
                                                    ? "dark"
                                                    : "light"
                                            }
                                            onEmojiSelect={(emoji) =>
                                                setMessage(
                                                    (prev) =>
                                                        prev + emoji.native
                                                )
                                            }
                                        />
                                    </div>
                                )}

                                {/* Image Preview */}
                                {selectedImages.length > 0 && (
                                    <div className="flex overflow-x-auto gap-2 p-2 bg-gray-100 dark:bg-[#0a0e25] rounded-lg">
                                        {selectedImages.map((img) => (
                                            <div
                                                key={img.id}
                                                className="relative"
                                            >
                                                <img
                                                    src={img.url}
                                                    className="h-10 w-10 rounded border"
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleRemoveImage(img.id)
                                                    }
                                                    className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded-full"
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Input */}
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="relative w-full">
                                        <button
                                            onClick={() =>
                                                setShowEmojiPicker(
                                                    !showEmojiPicker
                                                )
                                            }
                                            className="absolute left-2 top-1/2 -translate-y-1/2"
                                        >
                                            <FiSmile className="text-gray-500 w-6 h-6" />
                                        </button>

                                        <textarea
                                            rows={1}
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                            placeholder="Type a message..."
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1b213a] border rounded-full"
                                        ></textarea>
                                    </div>

                                    <label className="p-2 border rounded-full cursor-pointer">
                                        <FiPaperclip />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>

                                    <button className="p-3 border rounded-full">
                                        <IoSend />
                                    </button>
                                </div>
                            </div>
                            {/* End Input */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
