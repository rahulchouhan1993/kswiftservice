import { Head, Link, router } from "@inertiajs/react";
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

import { MdDeleteForever } from "react-icons/md";
import { FaRegEye } from "react-icons/fa6";
import RoundBtn from "@/Components/RoundBtn";
import { useHelpers } from "@/Components/Helpers";
import { SlCalender } from "react-icons/sl";
import TextInput from "@/Components/TextInput";

export default function List({ list, search, status, states, cities }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { displayInRupee } = useHelpers();

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ];

    useEffect(() => {
        initTooltips();
        searchRef.current?.focus();
    }, []);

    /* ---------------- Debounced Visit ---------------- */
    const debounceVisit = (params) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.mechanic.list", params), {
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

    /* ---------------- Badges ---------------- */
    const badgeBase =
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize";

    const statusBadge = (status) => {
        const colors = {
            active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            inactive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        };
        return <span className={`${badgeBase} ${colors[status]}`}>{status}</span>;
    };

    const kycBadge = (completed) => {
        return (
            <span
                className={`${badgeBase} ${completed
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
            >
                {completed ? "Yes" : "No"}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Mechanics" />
            <div className="pt-[60px]" />

            <div className="p-2 sm:p-4">
                <div className="rounded-2xl bg-white dark:bg-[#0f1435] shadow-xl border border-gray-200 dark:border-blue-950">

                    <div className="p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-blue-900">
                        <table className="min-w-full text-sm">
                            <thead
                                className="bg-gray-100 dark:bg-[#0a0e25] text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-blue-900"
                            >
                                <tr>
                                    {/* Sr */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-12">
                                        Sr
                                    </th>

                                    {/* ID */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-20">
                                        #ID
                                    </th>

                                    {/* Mechanic */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-left w-56">
                                        Mechanic
                                    </th>

                                    {/* Bookings */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-24">
                                        Bookings
                                    </th>

                                    {/* Total Business */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-right w-32">
                                        Total Business
                                    </th>

                                    {/* Aadhar Verified */}
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center w-32">
                                        Aadhar Verified
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
                                        <td colSpan={9} className="py-10 text-center">
                                            <DataNotExist />
                                        </td>
                                    </tr>
                                ) : (
                                    list.data.map((l, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 dark:border-blue-900
                                                       hover:bg-gray-50 dark:hover:bg-[#12184a]"
                                        >
                                            <td className="px-3 py-2 text-center">{index + 1}</td>
                                            <td className="px-3 py-2 text-center">{l.id}</td>

                                            <td className="px-3 py-2">
                                                <UserAvatarCard user={l} />
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                <a
                                                    href={route("superadmin.booking.list", {
                                                        user_id: l.id,
                                                        user_type: "mechanic",
                                                    })}
                                                >
                                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {l.mechanic_booking_count}
                                                    </span>
                                                </a>
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                    {displayInRupee(l.mechanic_earnings_sum_amount || 0)}
                                                </span>
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {kycBadge(l.kyc_status === "complete")}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {statusBadge(l.status ? "active" : "inactive")}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {l.member_since}
                                            </td>

                                            {/* ================= ACTIONS ================= */}
                                            <td className="px-2 py-2 text-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-2">

                                                        <Link
                                                            href={route("superadmin.mechanic.details", { uuid: l.uuid })}
                                                            className="flex gap-2"
                                                        >
                                                            <RoundBtn>
                                                                <FaRegEye size={18} />
                                                                <span>View</span>
                                                            </RoundBtn>
                                                        </Link>

                                                        <Edit user={l} />

                                                        <StatusToggle
                                                            action={route(
                                                                "superadmin.mechanic.update.status",
                                                                { uuid: l.uuid }
                                                            )}
                                                            checked={l.status === 1}
                                                            roundBtn
                                                            roundBtnProps={{
                                                                label: "Status",
                                                            }}
                                                        />

                                                        <DeleteUserAction
                                                            action={route(
                                                                "superadmin.mechanic.delete",
                                                                { uuid: l.uuid }
                                                            )}
                                                            message="Are you sure you want to delete this mechanic?"
                                                            roundBtn
                                                            roundBtnProps={{
                                                                icon: <MdDeleteForever size={18} />,
                                                                label: "Delete",
                                                            }}
                                                        />

                                                        <Link
                                                            href={route("superadmin.booking.list", { user_id: l.id, user_type: 'mechanic' })}
                                                            className="flex gap-2"
                                                        >
                                                            <RoundBtn>
                                                                <SlCalender size={18} />
                                                                <span>Bookings</span>
                                                            </RoundBtn>
                                                        </Link>
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
