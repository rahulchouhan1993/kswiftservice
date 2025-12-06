import { Head, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { initTooltips } from "flowbite";
import Pagination from "@/Components/Pagination";
import DataNotExist from "@/Components/DataNotExist";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import UserAvatarCard from "@/Components/UserAvatarCard";
import { useHelpers } from "@/Components/Helpers";
import VehicleInfo from "@/Components/VehicleInfo";
import SelectInput from "@/Components/SelectInput";

export default function List({ list, search, status }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { capitalizeWords } = useHelpers();

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
    ];

    useEffect(() => {
        initTooltips();
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    const handleSearch = (e) => {
        const sval = e.target.value;
        if (search !== sval) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (!sval || sval.length > 0) {
                timerRef.current = setTimeout(() => {
                    router.visit(route('superadmin.mechanic_job.list', {
                        search: sval,
                    }), {
                        only: ['list', 'search', 'status'],
                        preserveScroll: true,
                    });
                }, 500);
            }
        }
    };

    const handleStatusChange = (e) => {
        const sval = e.target.value;
        if (!sval || sval.length > 0) {
            timerRef.current = setTimeout(() => {
                router.visit(route('superadmin.mechanic_job.list', {
                    status: sval,
                }), {
                    only: ['list', 'search', 'status'],
                    preserveScroll: true,
                });
            }, 500);
        }
    };

    const renderStatusBadge = (status) => {
        const base = "px-2 py-1 rounded text-xs font-semibold capitalize";
        const colors = {
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded",
            accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded",
            cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded",
        };

        return (
            <span className={`${base} ${colors[status] ?? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Mechanic Jobs List " />
            <div className="pt-[60px]"></div>

            <div className="sm:p-4 p-1 w-full">
                <div className="sm:p-4 p-1  w-full dark:bg-[#131836] bg-white shadow-lg rounded-lg">
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <input
                                ref={searchRef}
                                onKeyUp={handleSearch}
                                defaultValue={search}
                                type="text"
                                placeholder="Search by user..."
                                className="w-full px-4 py-1.5 border-gray-500 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e37]"
                            />
                        </div>
                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <SelectInput
                                id="status"
                                value={status}
                                onChange={handleStatusChange}
                                options={statusOptions}
                                placeholder="Filter By Status"
                            />
                        </div>

                    </div>


                    <div className="overflow-x-auto  border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                        <table className=" min-w-full bg-gray-100 text-black  dark:bg-[#0a0e25] dark:text-white">
                            <thead className="border-b border-gray-300 dark:border-blue-900 ">
                                <tr>
                                    <th className="p-2 text-start whitespace-nowrap">Sr. No</th>
                                    <th className="p-2 text-start whitespace-nowrap">Mechanic</th>
                                    <th className="p-2 text-start whitespace-nowrap">User</th>
                                    <th className="p-2 text-start whitespace-nowrap">Vechile</th>
                                    <th className="p-2 text-start whitespace-nowrap">Status</th>
                                    <th className="p-2 text-start whitespace-nowrap">Request Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center py-6 text-gray-600 dark:text-gray-300"
                                        >
                                            <DataNotExist />
                                        </td>
                                    </tr>
                                ) : (
                                    list.data.map((l, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white text-black hover:bg-gray-100 dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white"
                                        >
                                            <td className="p-2 text-sm">{index + 1}</td>
                                            <td className="p-2 text-sm">
                                                {l?.mechanic ? (
                                                    <UserAvatarCard user={l?.mechanic} />
                                                ) : (
                                                    "--"
                                                )}
                                            </td>
                                            <td className="p-2 text-sm">
                                                {l?.booking?.customer ? (
                                                    <UserAvatarCard user={l?.booking?.customer} />
                                                ) : (
                                                    "--"
                                                )}
                                            </td>
                                            <td className="p-2 text-sm">
                                                {l?.booking?.vehicle ? (
                                                    <VehicleInfo vehicle={l?.booking?.vehicle} />
                                                ) : (
                                                    "--"
                                                )}
                                            </td>
                                            <td className="p-2 text-sm">{renderStatusBadge(l?.status)}</td>
                                            <td className="p-2 text-sm">{l?.received_at}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>

                        {(list?.total > 0 && list?.last_page > 1)
                            ? <Pagination paginate={list} className="my-4" />
                            : <></>}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
