import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { initTooltips } from "flowbite";
import { useHelpers } from "@/Components/Helpers";
import Pagination from "@/Components/Pagination";
import DataNotExist from "@/Components/DataNotExist";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import UserAvatarCard from "@/Components/UserAvatarCard";
import RowActionsMenu from "@/Components/RowActionsMenu";
import ManageStatus from "./ManageStatus";
import NoteTooltip from "@/Components/NoteTooltip";

export default function WalletWithdrawals({ list, search, status}) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { displayInRupee } = useHelpers();

    const statusOptions = [
        { value: "", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "in_process", label: "In Process" },
        { value: "completed", label: "Completed" },
        { value: "rejected", label: "Rejected" },
    ];

    useEffect(() => {
        initTooltips();
        if (searchRef.current) searchRef.current.focus();
    }, []);

    const handleSearch = (e) => {
        const sval = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.withdrawal.requests"), {
                data: {
                    search: sval,
                    status
                },
                preserveScroll: true,
            });
        }, 500);
    };

    const handleStatusChange = (e) => {
        const sval = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.withdrawal.requests"), {
                data: {
                    search,
                    status: sval
                },
                preserveScroll: true,
            });
        }, 300);
    };

    const badgeBase = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize";
    const paymentBadge = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
            rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            in_process: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        };

        return <span className={`${badgeBase} ${colors[status]}`}>{status}</span>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Withdrawal Requests" />
            <div className="pt-[60px]"></div>

            <div className="sm:p-4 p-1 w-full">
                <div className="sm:p-4 p-1 w-full dark:bg-[#131836] bg-white shadow-lg rounded-lg">

                    {/* Filters */}
                    <div className="mb-4 flex flex-wrap items-center gap-4">

                        {/* Status */}
                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <SelectInput
                                id="status"
                                value={status}
                                onChange={handleStatusChange}
                                options={statusOptions}
                                placeholder="Filter By Status"
                            />
                        </div>

                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <input
                                ref={searchRef}
                                defaultValue={search}
                                onKeyUp={handleSearch}
                                type="text"
                                placeholder="Search by name, email, phone..."
                                className="w-full px-4 py-1.5 border-gray-500 rounded-md shadow-sm
                                focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e37]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                        <table className="min-w-full bg-gray-100 text-black dark:bg-[#0a0e25] dark:text-white">
                            <thead className="border-b border-gray-300 dark:border-blue-900">
                                <tr>
                                    <th className="p-2 text-start">Mechanic</th>
                                    <th className="p-2 text-center">Amount</th>
                                    <th className="p-2 text-center">Status</th>
                                    <th className="p-2 text-center">Request Date</th>
                                    <th className="p-2 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-gray-600 dark:text-gray-300">
                                            <DataNotExist />
                                        </td>
                                    </tr>
                                ) : (
                                    list.data.map((l, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white hover:bg-gray-100 text-black text-center
                                            dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white"
                                        >
                                            <td className="p-2 text-start">
                                                <UserAvatarCard user={l?.mechanic} />
                                            </td>

                                            <td className="p-2 text-center">
                                                {displayInRupee(l?.amount)}
                                            </td>

                                            <td className="p-2 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {paymentBadge(l.status)}
                                                    {l?.status === "completed" && l?.note ? (
                                                        <NoteTooltip note={l.note} />
                                                    ) : l?.status === "rejected" && l?.rejection_reason ? (
                                                        <NoteTooltip note={l.rejection_reason} />
                                                    ) : null}
                                                </div>
                                            </td>

                                            <td className="p-2 text-center">{l?.received_at || "--"}</td>    
                                            <td className="p-2 flex justify-center items-center">
                                                {(l?.status === 'pending' || l?.status === 'in_process') ? (
                                                    <RowActionsMenu>
                                                        <div className="flex flex-col gap-2">
                                                            <ManageStatus request={l} />
                                                        </div>
                                                    </RowActionsMenu>
                                                ) : '--'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {list?.total > 0 && list?.last_page > 1 && (
                            <Pagination paginate={list} className="my-4" />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
