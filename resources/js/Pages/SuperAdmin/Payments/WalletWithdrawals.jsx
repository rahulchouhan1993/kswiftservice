import { Head, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
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
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { RiDownloadCloudFill } from "react-icons/ri";
import PaymentDetails from "./PaymentDetails";

export default function WalletWithdrawals({
    list,
    search,
    status,
    start_date,
    end_date,
}) {
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

    /**
     ✅ CENTRAL ROUTER FUNCTION
     Keeps filters + pagination stable
     */
    const visit = (params = {}) => {
        router.get(
            route("superadmin.withdrawal.requests"),
            {
                search,
                status,
                start_date,
                end_date,
                ...params,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    /**
     ✅ Debounce Helper
     */
    const debounceVisit = (params, delay = 400) => {
        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            visit(params);
        }, delay);
    };

    /**
     ✅ Filters
     */

    const handleSearch = (e) => {
        debounceVisit({ search: e.target.value }, 500);
    };

    const handleStatusChange = (e) => {
        debounceVisit({ status: e.target.value });
    };

    const handleStartDateChange = (e) => {
        debounceVisit({ start_date: e.target.value });
    };

    const handleEndDateChange = (e) => {
        debounceVisit({ end_date: e.target.value });
    };

    /**
     ✅ Badge UI
     */
    const badgeBase =
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize";

    const paymentBadge = (status) => {
        const colors = {
            pending:
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
            rejected:
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            completed:
                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            in_process:
                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        };

        return (
            <span className={`${badgeBase} ${colors[status] || ""}`}>
                {status.replace("_", " ")}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Withdrawal Requests" />

            <div className="pt-[60px]" />

            <div className="sm:p-4 p-1 w-full">
                <div className="sm:p-4 p-2 w-full dark:bg-[#131836] bg-white shadow-lg rounded-lg">
                    
                    {/* ================= FILTERS ================= */}

                    <div className="mb-5 flex flex-wrap items-center gap-4">

                        {/* Status */}
                        <div className="flex-1 w-full sm:max-w-[220px]">
                            <SelectInput
                                id="status"
                                value={status || ""}
                                onChange={handleStatusChange}
                                options={statusOptions}
                                placeholder="Filter By Status"
                            />
                        </div>

                        {/* Search */}
                        <div className="flex-1 w-full sm:max-w-[260px]">
                            <input
                                ref={searchRef}
                                defaultValue={search}
                                onChange={handleSearch}
                                type="text"
                                placeholder="Search name, phone, email..."
                                className="w-full px-4 py-2 border-gray-400 rounded-md shadow-sm
                                focus:ring-0 focus:border-gray-600
                                text-gray-900 dark:text-gray-200
                                dark:bg-[#0a0e37]"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="flex-1 w-full sm:max-w-[180px]">
                            <input
                                value={start_date || ""}
                                onChange={handleStartDateChange}
                                type="date"
                                className="w-full px-4 py-2 border-gray-400 rounded-md shadow-sm
                                focus:ring-0 focus:border-gray-600
                                text-gray-900 dark:text-gray-200
                                dark:bg-[#0a0e37]"
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex-1 w-full sm:max-w-[180px]">
                            <input
                                value={end_date || ""}
                                onChange={handleEndDateChange}
                                type="date"
                                className="w-full px-4 py-2 border-gray-400 rounded-md shadow-sm
                                focus:ring-0 focus:border-gray-600
                                text-gray-900 dark:text-gray-200
                                dark:bg-[#0a0e37]"
                            />
                        </div>
                    </div>

                    {/* ================= TABLE ================= */}

                    <div className="overflow-x-auto border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                        <table className="min-w-full bg-gray-100 text-black dark:bg-[#0a0e25] dark:text-white">
                            
                            <thead className="border-b border-gray-300 dark:border-blue-900">
                                <tr>
                                    <th className="p-3 text-start">Mechanic</th>
                                    <th className="p-3 text-center">Amount</th>
                                    <th className="p-3 text-center">Status</th>
                                    <th className="p-3 text-center">Request Date</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-10 text-center text-gray-600 dark:text-gray-300"
                                        >
                                            <DataNotExist />
                                        </td>
                                    </tr>
                                ) : (
                                    list.data.map((l, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white hover:bg-gray-100 text-black text-center
                                            dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white transition"
                                        >
                                            {/* Mechanic */}
                                            <td className="p-3 text-start">
                                                <UserAvatarCard user={l?.mechanic} />
                                            </td>

                                            {/* Amount */}
                                            <td className="p-3">
                                                {displayInRupee(l?.amount)}
                                            </td>

                                            {/* Status */}
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">

                                                    {paymentBadge(l.status)}

                                                    {/* Rejection reason */}
                                                    {l?.status === "rejected" &&
                                                        l?.rejection_reason && (
                                                            <NoteTooltip
                                                                note={l.rejection_reason}
                                                                Icon={
                                                                    ExclamationTriangleIcon
                                                                }
                                                                iconClass="text-red-500"
                                                            />
                                                        )}

                                                    {/* Invoice */}
                                                    {l?.status === "completed" &&
                                                        l?.invoice_url && (
                                                            <a
                                                                href={l.invoice_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download
                                                                className="
                                                                    inline-flex items-center justify-center
                                                                    p-1 rounded-lg text-white
                                                                    bg-gradient-to-r from-[#1FA2FF] to-[#12D8FA]
                                                                    hover:from-[#12D8FA] hover:to-[#1FA2FF]
                                                                    shadow-md hover:shadow-lg
                                                                    transition-all duration-200
                                                                    hover:-translate-y-0.5
                                                                "
                                                            >
                                                                <RiDownloadCloudFill className="w-5 h-5" />
                                                            </a>
                                                        )}
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="p-3">
                                                {l?.received_at || "--"}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-3 flex justify-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-2">
                                                        {(l?.status === "pending" ||
                                                            l?.status ===
                                                                "in_process") && (
                                                            <ManageStatus request={l} />
                                                        )}

                                                        <PaymentDetails payment={l} />
                                                    </div>
                                                </RowActionsMenu>
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
