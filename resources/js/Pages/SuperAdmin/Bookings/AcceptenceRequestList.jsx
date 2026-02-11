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
import NoteTooltip from "@/Components/NoteTooltip";

export default function AcceptenceRequestList({ list, search, status }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { replaceUnderscoreWithSpace } = useHelpers();

    const acceptenceStatusOptions = [
        { value: "", label: "All" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
    ];

    useEffect(() => {
        initTooltips();
        searchRef.current?.focus();
    }, []);

    const debounceVisit = (params) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.booking.requests", params), {
                only: ["list", "search", "status"],
                preserveScroll: true,
            });
        }, 400);
    };

    const handleSearch = (e) => {
        debounceVisit({
            search: e.target.value,
            status
        });
    };

    const handleStatusChange = (e) => {
        debounceVisit({
            status: e.target.value,
            search
        });
    };

    const badgeBase = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize";
    const statusBadge = (status) => {
        console.log('status', status);
        const colors = {
            rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        };
        return <span className={`${badgeBase} ${colors[status]}`}>{replaceUnderscoreWithSpace(status)}</span>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Acceptence Request List" />
            <div className="pt-[60px]" />

            <div className="p-2 sm:p-4">
                <div className="rounded-2xl bg-white dark:bg-[#0f1435] shadow-xl border border-gray-200 dark:border-blue-950">

                    {/* Filters */}
                    <div className="p-4 flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:max-w-[220px]">
                            <SelectInput
                                value={status}
                                onChange={handleStatusChange}
                                options={acceptenceStatusOptions}
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
                                        Vehicle
                                    </th>

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Mecanic
                                    </th>

                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Estimated Delivery Date / Note
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
                                        <td colSpan={7} className="py-10 text-center">
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
                                                <VehicleInfo vehicle={l.booking.vehicle} />
                                            </td>

                                            <td className="px-3 py-2">
                                                <UserAvatarCard user={l.mechanic} />
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                 <div className="flex items-center justify-center gap-2">
                                                    {l.delivery_date || "--"}
                                                    <NoteTooltip note={l.note} />
                                                </div>
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {statusBadge(l.status)}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-1">

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
