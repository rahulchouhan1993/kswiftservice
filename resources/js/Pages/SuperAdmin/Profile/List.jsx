import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { MdDelete, MdOutlineSecurity } from "react-icons/md";
import UpdateProfileInformation from "./Partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import DeleteUserForm from "./Partials/DeleteUserForm";
import SecurityForm from "./Partials/SecurityForm";
import SettingForm from "./Partials/SettingForm";
import UserProfileForm from "./Partials/UserProfileForm";
import { useState } from 'react';
import { FaEdit, FaExchangeAlt, FaRegUser, FaUser } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

export default function List() {
    const user = usePage().props.auth.user;
    console.log('user', user);
    const [selectedTab, setSelectedTab] = useState('user-info');
    const renderContent = () => {
        switch (selectedTab) {
            case 'user-info':
                return <UserProfileForm userData={user} />;
            case 'edit-info':
                return <UpdateProfileInformation />;
            case 'change-password':
                return <UpdatePasswordForm userData={user} />;
            default:
                return <div>Select a section</div>;
        }
    };
    return (
        <AuthenticatedLayout>
            <Head title="Group" />

            <div className=" p-4 w-full pt-[76px]">
                <div className="p-4 w-full dark:bg-[#131836] bg-white shadow-lg rounded-lg">
                    <div>
                        <h1 className="text-2xl p-2 w-full flex items-center gap-2 justify-center rounded-lg dark:bg-blue-950 bg-gray-100 font-bold text-center text-gray-800 dark:text-white mb-4">
                            <FaUser /> SuperAdmin Profile
                        </h1>
                    </div>

                    <div className="overflow-x-auto">
                        <div className=" flex items-start flex-col md:flex-row ">
                            <div className=" w-full md:w-auto flex md:flex-col items-center md:py-5 p-1 px-2 rounded-lg gap-4 text-lg border  border-gray-300 dark:border-blue-900 bg-gray-100 dark:bg-blue-950 overflow-x-auto overflow-hidden shadow-lg">
                                <h2 className="w-full text-start px-1 whitespace-nowrap">Quick Access:-</h2>
                                <button className="whitespace-nowrap px-6 py-1 w-full text-start rounded-lg bg-gray-200 dark:bg-[#131836] border border-gray-300 dark:border-blue-900 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#0a0e25] flex items-center gap-3" onClick={() => setSelectedTab('user-info')}><FaRegUser /> User Info</button>
                                <button className="whitespace-nowrap px-6 py-1 w-full text-start rounded-lg bg-gray-200 dark:bg-[#131836] border border-gray-300 dark:border-blue-900 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#0a0e25] flex items-center gap-3" onClick={() => setSelectedTab('edit-info')}><FaEdit /> Info Edit</button>
                                <button className="whitespace-nowrap px-6 py-1 w-full text-start rounded-lg bg-gray-200 dark:bg-[#131836] border border-gray-300 dark:border-blue-900 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#0a0e25] flex items-center gap-3" onClick={() => setSelectedTab('change-password')}><FaExchangeAlt /> Password change</button>
                            </div>

                            {/* Right Content */}
                            <div className="md:ml-5 mt-3 md:mt-0  w-full md:flex-1 ">
                                <div className="h-full w-full bg-gray-100 p-2  sm:rounded-lg sm:p-4 dark:bg-blue-950 shadow-lg border  border-gray-300 dark:border-blue-900">
                                    {renderContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
