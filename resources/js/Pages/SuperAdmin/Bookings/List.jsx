import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import StatusToggle from "@/Components/StatusToggle";
import { initTooltips } from "flowbite";
import { useHelpers } from "@/Components/Helpers";
import Pagination from "@/Components/Pagination";
import DeleteUserAction from "@/Components/DeleteUserAction";
import DataNotExist from "@/Components/DataNotExist";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import UserAvatarCard from "@/Components/UserAvatarCard";
import { MdCloudDownload } from "react-icons/md";
import VehicleInfo from "@/Components/VehicleInfo";

export default function List({ list, search, status }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);

    const { displayInRupee } = useHelpers();

    const bookingStatusOptions = [
        { value: "", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
        { value: "completed", label: "Completed" },
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
                    router.visit(route('superadmin.booking.list', {
                        search: sval,
                    }), {
                        only: ['list', 'search'],
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
                router.visit(route('superadmin.booking.list', {
                    status: sval,
                }), {
                    only: ['list', 'search', 'status'],
                    preserveScroll: true,
                });
            }, 500);
        }
    };


    return (
        <AuthenticatedLayout>
            <Head title="Bookings List " />
            <div className="pt-[60px]"></div>

            <div className="sm:p-4 p-1 w-full">
                <div className="sm:p-4 p-1  w-full dark:bg-[#131836] bg-white shadow-lg rounded-lg">
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <SelectInput
                                id="status"
                                value={status}
                                onChange={handleStatusChange}
                                options={bookingStatusOptions}
                                placeholder="Filter By Status"
                            />
                        </div>

                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <input
                                ref={searchRef}
                                onKeyUp={handleSearch}
                                defaultValue={search}
                                type="text"
                                placeholder="Search booking id..."
                                className="w-full px-4 py-1.5 border-gray-500 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e37]"
                            />
                        </div>
                    </div>


                    <div className="overflow-x-auto  border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                        <table className=" min-w-full bg-gray-100 text-black  dark:bg-[#0a0e25] dark:text-white">
                            <thead className="border-b border-gray-300 dark:border-blue-900 ">
                                <tr>
                                    <th className="p-2 text-center whitespace-nowrap">#txnId</th>
                                    <th className="p-2 text-start whitespace-nowrap">Customer</th>
                                    <th className="p-2 text-start whitespace-nowrap">Mechanic</th>
                                    <th className="p-2 text-center whitespace-nowrap">Vehicle</th>
                                    <th className="p-2 text-center whitespace-nowrap">Booking Date</th>
                                    <th className="p-2 text-center whitespace-nowrap">Booking Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center py-6 text-gray-600 dark:text-gray-300"
                                        >
                                            <DataNotExist />
                                        </td>
                                    </tr>
                                ) : (
                                    list.data.map((l, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white text-black text-center hover:bg-gray-100 dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white"
                                        >
                                            <td className="p-2">{l?.booking_id}</td>
                                            <td className="p-2 text-start">
                                                <UserAvatarCard user={l?.customer} displayRole={false} />
                                            </td>
                                            <td className="p-2 text-start">
                                                {l?.mechanic ? <>
                                                    <UserAvatarCard user={l?.mechanic} />
                                                </> : 'Not Assigned'}
                                            </td>
                                            <td className="p-2 text-center">
                                                <VehicleInfo vehicle={l?.vehicle} />
                                            </td>
                                            <td className="p-2 text-center">{l?.date} - {l?.time}</td>
                                            <td className="p-2 text-center">{l?.status || '--'}</td>
                                            <td className="p-2 text-center">{l?.booking_status}</td>
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
