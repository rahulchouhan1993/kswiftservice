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
import { useHelpers } from "@/Components/Helpers";
import RejectedJobs from "./RejectedJobs";
import { CiViewList } from "react-icons/ci";

export default function List({ list, search, status, mechanics, user_id, user_type, role }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { replaceUnderscoreWithSpace } = useHelpers();

    const bookingStatusOptions = [
        { value: "", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "awaiting_acceptance", label: "Awaiting Acceptance" },
        { value: "awaiting_payment", label: "Awaiting Payment" },
        { value: "in_process", label: "In Process" },
        { value: "completed", label: "Completed" },
        { value: "closed", label: "Closed" },
        { value: "cancelled", label: "Cancelled" },
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

    const statusBadge = (status) => {
        console.log('status', status);
        const colors = {
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
            awaiting_acceptance: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            awaiting_payment: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
            closed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            in_process: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        };
        return <span className={`${badgeBase} ${colors[status]}`}>{replaceUnderscoreWithSpace(status)}</span>;
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
                            <thead className="bg-gray-100 dark:bg-[#0a0e25]">
                                <tr>
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Booking Id
                                    </th>

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Booking Date
                                    </th>

                                    {(role === 'mechanic' || role === null) && (
                                        <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                            Customer
                                        </th>
                                    )}

                                    {(role === 'customer' || role === null) && (
                                        <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                            Mechanic
                                        </th>
                                    )}

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Assigned Date
                                    </th>

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Delivery Date
                                    </th>

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Vehicle
                                    </th>

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Payment
                                    </th>

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Status
                                    </th>

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>


                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="py-10 text-center">
                                            <DataNotExist />
                                        </td>
                                    </tr>
                                ) : (
                                    list.data.map((l, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-gray-200 dark:border-blue-900 hover:bg-gray-50 dark:hover:bg-[#12184a]"
                                        >
                                            <td className="px-3 py-2 text-center">
                                                {l.booking_id}
                                            </td>

                                            <td className="px-3 py-2 text-center sm:table-cell hidden">
                                                {l.booking_date || "--"}
                                            </td>

                                            {(role === 'mechanic' || role === null) && (
                                                <td className="px-3 py-2">
                                                    <UserAvatarCard user={l.customer} />
                                                </td>
                                            )}

                                            {(role === 'customer' || role === null) && (
                                                <td className="px-3 py-2">
                                                    {l.mechanic ? (
                                                        <UserAvatarCard user={l.mechanic} />
                                                    ) : (
                                                        <span className="text-xs text-gray-500">
                                                            Not Assigned
                                                        </span>
                                                    )}
                                                </td>
                                            )}

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
                                                {statusBadge(l.booking_status)}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-1">
                                                        {l.mechanic_id && (
                                                            <Link
                                                                href={route("superadmin.booking.chat.list", { uuid: l.uuid })}
                                                            >
                                                                <RoundBtn>
                                                                    <MdOutlineChat />
                                                                    <span>Chats</span>
                                                                </RoundBtn>
                                                            </Link>
                                                        )}

                                                        <Link
                                                            href={route("superadmin.booking.requests", { uuid: l.uuid })}
                                                        >
                                                            <RoundBtn>
                                                                <CiViewList />
                                                                <span>Requests</span>
                                                            </RoundBtn>
                                                        </Link>

                                                        {['pending', 'awaiting_acceptance'].includes(l.booking_status) && (
                                                            <AssignMechanic booking={l} />
                                                        )}

                                                        {l?.rejected_mechanic_job ? <>
                                                            <RejectedJobs list={l?.rejected_mechanic_job} />
                                                        </> : ''}

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
