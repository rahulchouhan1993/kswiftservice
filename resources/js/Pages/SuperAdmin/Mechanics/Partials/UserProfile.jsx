import {
    MdEmail,
    MdOutlinePhone,
    MdWhatsapp,
    MdLocationOn,
    MdBadge,
} from "react-icons/md";
import { FaUserAlt, FaAddressCard, FaIdCard } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { useHelpers } from "@/Components/Helpers";
import StatusToggle from "@/Components/StatusToggle";
import Tooltip from "@/Components/Tooltip";

export default function UserProfile({ user }) {
    const { capitalizeWords, displayInRupee } = useHelpers();

    const infoCard = (icon, label, value) => (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1e2a4a]">
            <div className="text-2xl text-blue-600 dark:text-blue-400">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                    {label}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {value || "--"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-white dark:bg-blue-950 rounded-2xl shadow-xl border border-gray-200 dark:border-blue-900 p-6 space-y-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-300 dark:border-blue-900">
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-blue-800">
                    <img
                        src={user?.profile_photo_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {capitalizeWords(user?.name)} {capitalizeWords(user?.last_name)}
                    </h2>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">

                        <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold text-sm min-w-[120px] text-center shadow-sm">
                            Role: {capitalizeWords(user?.role)}
                        </div>

                        <div className={`flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold min-w-[120px] text-center shadow-sm ${user?.kyc_status === "approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : user?.kyc_status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                        >
                            KYC: {capitalizeWords(user?.kyc_status)}
                        </div>


                        <div
                            className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium w-fit border shadow-sm
                                ${user?.status === 1 ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800"
                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800"}
                            `}
                        >
                            <span className="font-semibold">
                                {user?.status === 1 ? "Active" : "Inactive"}
                            </span>

                            <div className="flex items-center" data-tooltip-target={`tooltip-status-${user?.uuid}`}>
                                <StatusToggle
                                    action={route("superadmin.user.update.status", { uuid: user?.uuid })}
                                    checked={user?.status === 1}
                                    className="!mb-0 !scale-90"
                                />
                            </div>

                            <Tooltip
                                targetEl={`tooltip-status-${user?.uuid}`}
                                title={user?.status === 1 ? "Deactivate User" : "Activate User"}
                            />
                        </div>

                        <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 font-semibold text-sm min-w-[120px] text-center shadow-sm">
                            Total Business: {displayInRupee(user?.mechanic_earnings_sum_amount || 0)}
                        </div>

                        <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 font-semibold text-sm min-w-[120px] text-center shadow-sm">
                            Total Bookings: {user?.mechanic_booking_count || 0}
                        </div>



                    </div>
                </div>
            </div>

            {/* GRID DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {infoCard(<FaUserAlt />, "Full Name", user?.name)}
                {infoCard(<MdEmail />, "Email", user?.email)}
                {infoCard(<MdOutlinePhone />, "Phone Number", user?.phone)}
                {infoCard(<MdWhatsapp className="text-green-600" />, "WhatsApp", user?.whatsapp_number)}
                {infoCard(<FaUserAlt />, "Date of Birth", user?.dob)}
                {infoCard(<FaIdCard />, "Aadhar Card", user?.aadharcard_no)}
            </div>

            {/* TIMESTAMPS */}
            <div className="bg-gray-100 dark:bg-[#1e2a4a] rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-3 text-gray-700 dark:text-gray-400 text-sm border border-gray-300 dark:border-blue-800">
                <div className="flex items-center gap-2">
                    <BsClockHistory />
                    Created: {formatDistanceToNow(new Date(user?.created_at))} ago
                </div>
                <div className="flex items-center gap-2">
                    <BsClockHistory />
                    Updated: {formatDistanceToNow(new Date(user?.updated_at))} ago
                </div>
            </div>

        </div >
    );
}
