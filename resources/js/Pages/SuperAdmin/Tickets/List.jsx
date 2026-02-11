import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { initTooltips } from "flowbite";
import { useHelpers } from "@/Components/Helpers";
import Pagination from "@/Components/Pagination";
import DataNotExist from "@/Components/DataNotExist";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import UserAvatarCard from "@/Components/UserAvatarCard";
import RowActionsMenu from "@/Components/RowActionsMenu";
import RoundBtn from "@/Components/RoundBtn";
import { MdOutlineChat } from "react-icons/md";

export default function List({ list, search, status }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { displayInRupee } = useHelpers();

    const statusOptions = [
        { value: "", label: "All" },
        { value: "open", label: "Open" },
        { value: "in_process", label: "In Process" },
        { value: "closed", label: "Closed" },
    ];

    const statusUpdateOptions = [
        { value: "open", label: "Open" },
        { value: "in_process", label: "In Process" },
        { value: "closed", label: "Closed" },
    ];

    useEffect(() => {
        initTooltips();
        if (searchRef.current) searchRef.current.focus();
    }, []);

    const handleSearch = (e) => {
        const sval = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.ticket.list"), {
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
            router.visit(route("superadmin.ticket.list"), {
                data: {
                    search,
                    status: sval,
                },
                preserveScroll: true,
            });
        }, 300);
    };


    const handleUpdateStatus = (uuid) => (e) => {
        const sval = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.visit(
                route("superadmin.ticket.update.status", { uuid }),
                {
                    method: "post",
                    data: {
                        status: sval,
                    },
                    preserveScroll: true,
                }
            );
        }, 300);
    };


    const getStatusBorder = (status) => {
        switch (status) {
            case "open":
                return "border-blue-500 bg-blue-50 text-blue-700";
            case "in_process":
                return "border-yellow-500 bg-yellow-50 text-yellow-700";
            case "closed":
                return "border-red-500 bg-red-50 text-red-700";
            default:
                return "border-gray-300";
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payment History List" />
            <div className="pt-[60px]"></div>

            <div className="sm:p-4 p-1 w-full">
                <div className="sm:p-4 p-1 w-full dark:bg-[#131836] bg-white shadow-lg rounded-lg">
                    <div className="mb-4 flex flex-wrap items-center gap-4">
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
                                placeholder="Search ticket id..."
                                className="w-full px-4 py-1.5 border-gray-500 rounded-md shadow-sm
                                focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e37]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                        <table className="min-w-full bg-gray-100 text-black dark:bg-[#0a0e25] dark:text-white">
                            <thead className="border-b border-gray-300 dark:border-blue-900">
                                <tr>
                                    <th className="p-2 text-center">#txnId</th>
                                    <th className="p-2 text-center">#bookingId</th>
                                    <th className="p-2 text-start">User</th>
                                    <th className="p-2 text-center">Subject</th>
                                    <th className="p-2 text-center">Status</th>
                                    <th className="p-2 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-6 text-center text-gray-600 dark:text-gray-300">
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
                                            <td className="p-2">{l?.ticketId}</td>
                                            <td className="p-2">{l?.booking?.booking_id}</td>
                                            <td className="p-2 text-start">
                                                <UserAvatarCard user={l?.user} />
                                            </td>
                                            <td className="p-2">{l?.subject || "--"}</td>
                                            <td className="px-3 py-2 align-middle">
                                                <SelectInput
                                                    id="status"
                                                    value={l.ticket_status}
                                                    onChange={handleUpdateStatus(l.uuid)}
                                                    options={statusUpdateOptions}
                                                    className={`h-9 text-sm rounded-lg border bg-white px-2 ${getStatusBorder(l.ticket_status)}`}
                                                />
                                            </td>
                                            <td className="p-2">{l?.received_at || "--"}</td>
                                            <td className="p-2 flex justify-center items-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-2">
                                                        <Link
                                                            href={route("superadmin.ticket.chats", { uuid: l.uuid })}
                                                        >
                                                            <RoundBtn>
                                                                <MdOutlineChat />
                                                                <span>Chats</span>
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

                        {list?.total > 0 && list?.last_page > 1 && (
                            <Pagination paginate={list} className="my-4" />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
