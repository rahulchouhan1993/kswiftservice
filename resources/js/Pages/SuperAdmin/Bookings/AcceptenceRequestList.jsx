import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { initTooltips } from "flowbite";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import Pagination from "@/Components/Pagination";
import DataNotExist from "@/Components/DataNotExist";
import UserAvatarCard from "@/Components/UserAvatarCard";
import VehicleInfo from "@/Components/VehicleInfo";
import RowActionsMenu from "@/Components/RowActionsMenu";
import TextInput from "@/Components/TextInput";
import { useHelpers } from "@/Components/Helpers";
import NoteTooltip from "@/Components/NoteTooltip";
import Button from "@/Components/Button";
import RoundBtn from "@/Components/RoundBtn";
import { FaWarehouse } from "react-icons/fa6";
import ConfirmDialog from "@/Components/ConfirmDialog";
import axios from "axios";
import { useAlerts } from "@/Components/Alerts";

export default function AcceptenceRequestList({ list, booking, search, status }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { replaceUnderscoreWithSpace } = useHelpers();
    const { successAlert, errorAlert, errorsHandling } = useAlerts();

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
            router.get(
                route("superadmin.booking.requests", { uuid: booking.uuid }),
                { search: params.search ?? "", status: params.status ?? "" },
                {
                    only: ["list", "search", "status", "booking"],
                    preserveScroll: true,
                    replace: true,
                }
            );
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



    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const handleAssignClick = (row) => {
        setSelectedRow(row);
        setOpenConfirm(true);
    };

    const handleConfirmAssign = () => {
        router.post(
            route("superadmin.booking.assign.mechanic"),
            {
                garage_id: selectedRow.mechanic.latest_garage[0].id,
                booking_id: selectedRow.booking_id,
                accepted_by: 'admin',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenConfirm(false);
                    successAlert("Booking assigned successfully");
                },

                onError: () => {
                    errorAlert("Failed to assign booking");
                }
            }
        );
    };


    return (
        <AuthenticatedLayout>
            <Head title="Acceptence Request List" />
            <div className="pt-[60px]" />

            <ConfirmDialog
                isOpen={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmAssign}
                message="Are you sure you want to assign this booking to the selected mechanic?"
                confirmText="Yes, Assign"
                cancelText="Cancel"
            />
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
                                placeholder="Search by mechanic name, email, phone..."
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
                                        Admin Status
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
                                                {l.booking.booking_id}
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
                                                {l.admin_status || '--'}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-1">
                                                    <RoundBtn
                                                        onClick={() => handleAssignClick(l)}
                                                    >
                                                        <FaWarehouse />
                                                        <span>Assign Mechanic</span>
                                                    </RoundBtn>    
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
