import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { initTooltips } from "flowbite";

import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import Pagination from "@/Components/Pagination";
import DataNotExist from "@/Components/DataNotExist";
import UserAvatarCard from "@/Components/UserAvatarCard";
import VehicleInfo from "@/Components/VehicleInfo";
import AssignMechanic from "./AssignMechanic";
import BookingDetails from "./BookingDetails";
import PaymentDetails from "./PaymentDetails";
import RowActionsMenu from "@/Components/RowActionsMenu";
import RoundBtn from "@/Components/RoundBtn";

import { MdMarkUnreadChatAlt, MdOutlineChat } from "react-icons/md";
import TextInput from "@/Components/TextInput";

export default function List({ list, search, status, mechanics, user_id, user_type }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);

    const bookingStatusOptions = [
        { value: "", label: "All" },
        { value: "requested", label: "Requested" },
        { value: "pending", label: "Pending" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
        { value: "completed", label: "Completed" },
    ];

    useEffect(() => {
        initTooltips();
        searchRef.current?.focus();
    }, []);

    const debounceVisit = (params) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.booking.list", params), {
                only: ["list", "search", "status"],
                preserveScroll: true,
            });
        }, 400);
    };

    const handleSearch = (e) => {
        debounceVisit({
            search: e.target.value,
            status,
            user_id,
            user_type,
        });
    };

    const handleStatusChange = (e) => {
        debounceVisit({
            status: e.target.value,
            search,
            user_id,
            user_type,
        });
    };

    const badgeBase = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize";

    const bookingBadge = (status) => {
        const colors = {
            requested: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
            accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        };

        return <span className={`${badgeBase} ${colors[status] || "bg-gray-200 text-gray-700"}`}>{status}</span>;
    };

    const paymentBadge = (status) => {
        const colors = {
            success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        };

        return <span className={`${badgeBase} ${colors[status]}`}>{status}</span>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bookings List" />
            <div className="pt-[60px]" />

            <div className="p-2 sm:p-4">
                <div className="rounded-2xl bg-white dark:bg-[#0f1435]
                                shadow-xl border border-gray-200 dark:border-blue-950">

                    {/* Filters */}
                    <div className="p-4 flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:max-w-[220px]">
                            <SelectInput
                                value={status}
                                onChange={handleStatusChange}
                                options={bookingStatusOptions}
                                placeholder="Filter Status"
                            />
                        </div>

                        <div className="w-full sm:max-w-[260px]">
                            <TextInput
                                ref={searchRef}
                                onKeyUp={handleSearch}
                                defaultValue={search}
                                placeholder="Search booking ID..."
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto overflow-y-visible rounded-xl border border-gray-200 dark:border-blue-900">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-[#0a0e25] text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-blue-900">
                                <tr>
                                    {[
                                        "Booking Id",
                                        "Booking Date",
                                        "Customer",
                                        "Mechanic",
                                        "Assigned Date",
                                        "Delivery Date",
                                        "Vehicle",
                                        "Payment",
                                        "Status",
                                        "Action",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-3 py-2 text-xs font-semibold uppercase whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-10 text-center">
                                            <DataNotExist />
                                        </td>
                                    </tr>
                                ) : (
                                    list.data.map((l, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-gray-200 dark:border-blue-900 hover:bg-gray-50 dark:hover:bg-[#12184a]transition"
                                        >
                                            <td className="px-3 py-2 text-center">{l.booking_id}</td>
                                            <td className="px-3 py-2 text-center sm:table-cell hidden">
                                                {l.booking_date || "--"}
                                            </td>

                                            <td className="px-3 py-2">
                                                <UserAvatarCard user={l.customer} />
                                            </td>

                                            <td className="px-3 py-2">
                                                {l.mechanic ? (
                                                    <UserAvatarCard user={l.mechanic} />
                                                ) : (
                                                    <span className="text-xs text-gray-500">Not Assigned</span>
                                                )}
                                            </td>

                                            <td className="px-3 py-2 text-center sm:table-cell hidden">
                                                {l.assigned_at || "--"}
                                            </td>

                                            <td className="px-3 py-2 text-center sm:table-cell hidden">
                                                {l.delivered_at || "--"}
                                            </td>

                                            <td className="px-3 py-2 text-center sm:table-cell hidden">
                                                <VehicleInfo vehicle={l.vehicle} />
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {paymentBadge(l.payment?.status || "pending")}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {bookingBadge(l.booking_status)}
                                            </td>

                                            <td className="px-2 py-2 text-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-1">
                                                        {l.mechanic_id !== null && (
                                                            <Link
                                                                href={route("superadmin.booking.chat.list", { uuid: l.uuid })}
                                                                className="flex items-center"
                                                            >
                                                                <RoundBtn
                                                                    className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-400"
                                                                >
                                                                    <MdOutlineChat />
                                                                    <span>Chats</span>
                                                                </RoundBtn>

                                                            </Link>
                                                        )}

                                                        {l.booking_status !== 'accepted' && l.booking_status !== 'completed' && (
                                                            <AssignMechanic booking={l} />
                                                        )}

                                                        <BookingDetails booking={l} />

                                                        {l.payment && (
                                                            <PaymentDetails payment={l.payment} />
                                                        )}
                                                    </div>
                                                </RowActionsMenu>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {list.total > 0 && list.last_page > 1 && (
                        <Pagination paginate={list} className="my-4" />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
