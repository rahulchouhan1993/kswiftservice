import { Head } from "@inertiajs/react";
import { useState } from "react";
import { FaUser, FaRegUser, FaExchangeAlt, FaMapMarkedAlt, FaCar } from "react-icons/fa";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UserProfile from "./Partials/UserProfile";
import Addresses from "./Partials/Addresses";
import Vehicles from "./Partials/Vehicles";

export default function Details({ user }) {
    const [selectedTab, setSelectedTab] = useState("user-info");

    const renderContent = () => {
        switch (selectedTab) {
            case "user-info":
                return <UserProfile user={user} />;

            case "address-list":
                return <Addresses user={user} />;

            case "vehicle-list":
                return <Vehicles user={user} />;

            case "change-password":
                return <UpdatePasswordForm user={user} />;

            default:
                return <div>Select a section</div>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Details" />

            <div className="pt-[70px]"></div>

            <div className="w-full px-4 pb-10">
                <div className="
                    w-full
                    min-h-[calc(100vh-150px)]
                    dark:bg-[#101633] bg-white
                    rounded-2xl shadow-2xl border border-gray-200 dark:border-blue-900
                    p-6
                ">
                    {/* HEADER */}
                    <div className="mb-6">
                        <h1 className="text-xl font-bold flex justify-center items-center gap-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-blue-950 p-4 rounded-xl shadow-sm">
                            <FaUser /> Manage Mechanic — {user?.name}
                        </h1>
                    </div>

                    {/* LAYOUT */}
                    <div className="flex flex-col md:flex-row gap-6 h-full">

                        {/* SIDEBAR */}
                        <div className="
                            w-full md:w-64 bg-gray-100 dark:bg-blue-950 rounded-2xl shadow-lg
                            border border-gray-300 dark:border-blue-900 p-4
                        ">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Quick Access
                            </h2>

                            <div className="flex flex-col gap-3">

                                {/* USER INFO TAB */}
                                <button
                                    onClick={() => setSelectedTab("user-info")}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-medium
                                        transition-all
                                        ${selectedTab === "user-info"
                                            ? "bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]"
                                            : "bg-gray-200 dark:bg-[#131836] border-gray-300 dark:border-blue-900 text-gray-900 dark:text-white"
                                        }
                                    `}
                                >
                                    <FaRegUser /> User Info
                                </button>

                                {/* ADDRESS LIST TAB */}
                                <button
                                    onClick={() => setSelectedTab("address-list")}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-medium
                                        transition-all
                                        ${selectedTab === "address-list"
                                            ? "bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]"
                                            : "bg-gray-200 dark:bg-[#131836] border-gray-300 dark:border-blue-900 text-gray-900 dark:text-white"
                                        }
                                    `}
                                >
                                    <FaMapMarkedAlt /> Address List
                                </button>

                                {/* VEHICLE LIST */}
                                <button
                                    onClick={() => setSelectedTab("vehicle-list")}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-medium
                                        transition-all
                                        ${selectedTab === "vehicle-list"
                                            ? "bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]"
                                            : "bg-gray-200 dark:bg-[#131836] border-gray-300 dark:border-blue-900 text-gray-900 dark:text-white"
                                        }
                                    `}
                                >
                                    <FaCar /> Vehicle List
                                </button>

                                {/* CHANGE PASSWORD */}
                                <button
                                    onClick={() => setSelectedTab("change-password")}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-medium
                                        transition-all
                                        ${selectedTab === "change-password"
                                            ? "bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]"
                                            : "bg-gray-200 dark:bg-[#131836] border-gray-300 dark:border-blue-900 text-gray-900 dark:text-white"
                                        }
                                    `}
                                >
                                    <FaExchangeAlt /> Change Password
                                </button>

                            </div>
                        </div>

                        {/* RIGHT SIDE CONTENT */}
                        <div className="flex-1">
                            <div className="
                                w-full bg-gray-100 dark:bg-blue-950 rounded-2xl p-6 shadow-lg
                                border border-gray-300 dark:border-blue-900 min-h-[500px]
                            ">
                                {renderContent()}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
