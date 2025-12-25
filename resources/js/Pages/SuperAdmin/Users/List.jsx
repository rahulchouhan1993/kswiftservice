import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { initTooltips } from "flowbite";

import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import Pagination from "@/Components/Pagination";
import DataNotExist from "@/Components/DataNotExist";
import UserAvatarCard from "@/Components/UserAvatarCard";
import Add from "./Add";
import Edit from "./Edit";
import RowActionsMenu from "@/Components/RowActionsMenu";
import StatusToggle from "@/Components/StatusToggle";
import DeleteUserAction from "@/Components/DeleteUserAction";
import ActionItem from "@/Components/ActionItem";
import { Delete } from "lucide-react";
import { MdDeleteForever } from "react-icons/md";
import RoundBtn from "@/Components/RoundBtn";
import { FaRegEye } from "react-icons/fa6";
import TextInput from "@/Components/TextInput";
import { SlCalender } from "react-icons/sl";

export default function List({ list, search, status, states, cities }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ];

    useEffect(() => {
        initTooltips();
        searchRef.current?.focus();
    }, []);

    const debounceVisit = (params) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.user.list", params), {
                only: ["list", "search", "status"],
                preserveScroll: true,
            });
        }, 400);
    };

    const handleSearch = (e) => {
        debounceVisit({ search: e.target.value, status });
    };

    const handleStatusChange = (e) => {
        debounceVisit({ status: e.target.value, search });
    };

    const badgeBase =
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize";

    const statusBadge = (status) => {
        const colors = {
            active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            inactive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        };
        return <span className={`${badgeBase} ${colors[status]}`}>{status}</span>;
    };


    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />
            <div className="pt-[60px]" />

            <div className="p-2 sm:p-4">
                <div className="rounded-2xl bg-white dark:bg-[#0f1435] shadow-xl border border-gray-200 dark:border-blue-950">

                    <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-shrink-0">
                            <Add states={states} cities={cities} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="w-full sm:w-[220px]">
                                <SelectInput
                                    value={status}
                                    onChange={handleStatusChange}
                                    options={statusOptions}
                                    placeholder="Filter Status"
                                />
                            </div>

                            <div className="w-full sm:w-[260px]">
                                <TextInput
                                    ref={searchRef}
                                    onKeyUp={handleSearch}
                                    defaultValue={search}
                                    placeholder="Search by name, email, phone no..."
                                />
                            </div>
                        </div>
                    </div>


                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-blue-900">
                        <table className="min-w-full text-sm">
                            <thead
                                className="bg-gray-100 dark:bg-[#0a0e25] text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-blue-900"
                            >
                                <tr>
                                    {/* Sr.No */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-14">
                                        Sr.No
                                    </th>

                                    {/* Customer Id */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-28">
                                        Customer Id
                                    </th>

                                    {/* Name */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-left w-56">
                                        Name
                                    </th>

                                    {/* Total Bookings */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-32">
                                        Total Bookings
                                    </th>

                                    {/* Status */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-24">
                                        Status
                                    </th>

                                    {/* Member Since */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-32">
                                        Member Since
                                    </th>

                                    {/* Action */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-20">
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
                                    list.data.map((l, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 dark:border-blue-900 hover:bg-gray-50 dark:hover:bg-[#12184a]"
                                        >
                                            <td className="px-3 py-2 text-center">{index + 1}</td>
                                            <td className="px-3 py-2 text-center">{l.id}</td>

                                            <td className="px-3 py-2">
                                                <UserAvatarCard user={l} />
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {l.role === "customer" ? l.user_booking_count : l.mechanic_booking_count}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {statusBadge(l.status ? "active" : "inactive")}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {l.member_since}
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="px-2 py-2 text-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-2">
                                                        <RoundBtn
                                                            className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-400"
                                                        >
                                                            <Link
                                                                href={route("superadmin.user.details", { uuid: l.uuid })}
                                                                className="flex gap-2"
                                                            >
                                                                <FaRegEye size={18} />
                                                                <span>View Details</span>
                                                            </Link>
                                                        </RoundBtn>

                                                        <RoundBtn
                                                            className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-400"
                                                        >
                                                            <Link
                                                                href={route("superadmin.booking.list", { user_id: l.id, user_type: 'customer' })}
                                                                className="flex gap-2"
                                                            >
                                                                <SlCalender size={18} />
                                                                <span>View Bookings</span>
                                                            </Link>
                                                        </RoundBtn>

                                                        <Edit user={l} />
                                                        <DeleteUserAction
                                                            action={route(
                                                                "superadmin.user.delete",
                                                                { uuid: l.uuid }
                                                            )}
                                                            message="Are you sure you want to delete this user?"
                                                            roundBtn
                                                            roundBtnProps={{
                                                                icon: <MdDeleteForever size={18} />,
                                                                label: "Delete",
                                                                className: "bg-red-600 hover:bg-red-700 focus:ring-red-400"
                                                            }}
                                                        />
                                                        <StatusToggle
                                                            action={route("superadmin.user.update.status", { uuid: l.uuid })}
                                                            checked={l.status === 1}
                                                            roundBtn
                                                            roundBtnProps={{
                                                                label: "Status",
                                                                className: "bg-green-600 hover:bg-green-700",
                                                            }}
                                                        />

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
