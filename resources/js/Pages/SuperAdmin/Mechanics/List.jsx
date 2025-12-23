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
                <div className="rounded-2xl bg-white dark:bg-[#0f1435]
                                shadow-xl border border-gray-200 dark:border-blue-950">

                    {/* ================= Filters ================= */}
                    <div className="p-4 flex flex-col sm:flex-row gap-3">
                        <Add states={states} cities={cities} />

                        <div className="sm:max-w-[220px] w-full">
                            <SelectInput
                                value={status}
                                onChange={handleStatusChange}
                                options={statusOptions}
                                placeholder="Filter Status"
                            />
                        </div>

                        <div className="sm:max-w-[260px] w-full">
                            <input
                                ref={searchRef}
                                onKeyUp={handleSearch}
                                defaultValue={search}
                                placeholder="Search by name..."
                                className="w-full px-3 py-2 text-sm rounded-lg
                                           border border-gray-300 dark:border-blue-900
                                           bg-white dark:bg-[#0a0e25]
                                           text-gray-800 dark:text-gray-200
                                           focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* ================= Table ================= */}
                    <div className="overflow-x-auto rounded-xl
                                    border border-gray-200 dark:border-blue-900">
                        <table className="min-w-full text-sm">
                            <thead
                                className="bg-gray-100 dark:bg-[#0a0e25]
                                           text-gray-700 dark:text-gray-300
                                           border-b border-gray-300 dark:border-blue-900"
                            >
                                <tr>
                                    {[
                                        "Sr",
                                        "#ID",
                                        "Mechanic",
                                        "Bookings",
                                        "Aadhar Verified",
                                        "Status",
                                        "Member Since",
                                        "Action",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-3 py-2 text-xs font-semibold uppercase text-center"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-10 text-center">
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

                                                        <StatusToggle
                                                            action={route(
                                                                "superadmin.mechanic.update.status",
                                                                { uuid: l.uuid }
                                                            )}
                                                            checked={l.status === 1}
                                                            roundBtn
                                                            roundBtnProps={{
                                                                label: "Status",
                                                                className:
                                                                    "bg-green-600 hover:bg-green-700",
                                                            }}
                                                        />

                                                        <RoundBtn
                                                            className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-400"
                                                        >
                                                            <Link
                                                                href={route("superadmin.mechanic.details", { uuid: l.uuid })}
                                                                className="flex gap-2"
                                                            >
                                                                <FaRegEye size={18} />
                                                                <span>View Info</span>
                                                            </Link>
                                                        </RoundBtn>
                                                        <Edit user={l} />

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
                                                                className:
                                                                    "bg-red-600 hover:bg-red-700 focus:ring-red-400",
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
