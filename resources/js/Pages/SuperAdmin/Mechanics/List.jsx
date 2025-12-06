import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import Tooltip from "@/Components/Tooltip";
import StatusToggle from "@/Components/StatusToggle";
import { initTooltips } from "flowbite";
import { useHelpers } from "@/Components/Helpers";
import Pagination from "@/Components/Pagination";
import DeleteUserAction from "@/Components/DeleteUserAction";
import DataNotExist from "@/Components/DataNotExist";
import UsersLayout from "../Layouts/UsersLayout";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import UserAvatarCard from "@/Components/UserAvatarCard";
import Add from "./Add";
import Edit from "./Edit";
import RowActionsMenu from "@/Components/RowActionsMenu";

export default function List({ list, search, status, states, cities }) {
    console.log('list', list);
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { capitalizeWords } = useHelpers();
    const auth = usePage().props.auth.user;

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "InActive" },
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
            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                router.visit(route("superadmin.mechanic.list", {
                    search: sval,
                }), {
                    only: ["list", "search"],
                    preserveScroll: true,
                });
            }, 500);
        }
    };


    const handleUserTypeChange = (e) => {
        const sval = e.target.value;

        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.mechanic.list", {
                type: sval,
            }), {
                only: ["list", "search"],
                preserveScroll: true,
            });
        }, 500);
    };


    const handleStatusChange = (e) => {
        const sval = e.target.value;

        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.mechanic.list", {
                status: sval,
            }), {
                only: ["list", "search", "status"],
                preserveScroll: true,
            });
        }, 500);
    };



    return (
        <AuthenticatedLayout>
            <Head title="Manage Users List " />
            <div className="pt-[60px]">
                {/* <UsersLayout /> */}
            </div>

            <div className="sm:p-4 p-1 w-full">
                <div className="sm:p-4 p-1  w-full dark:bg-[#131836] bg-white shadow-lg rounded-lg">
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                        <div className="flex-1 w-full sm:w-auto sm:max-w-[100px]">
                            <Add states={states} cities={cities} />
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

                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <input
                                ref={searchRef}
                                onKeyUp={handleSearch}
                                defaultValue={search}
                                type="text"
                                placeholder="Search by name..."
                                className="w-full px-4 py-1.5 border-gray-500 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e37]"
                            />
                        </div>
                    </div>


                    <div className="overflow-x-auto  border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                        <table className=" min-w-full bg-gray-100 text-black  dark:bg-[#0a0e25] dark:text-white">
                            <thead className="border-b border-gray-300 dark:border-blue-900 ">
                                <tr>
                                    <th className="p-2 text-center whitespace-nowrap">Sr. No</th>
                                    <th className="p-2 text-start whitespace-nowrap">Name</th>
                                    <th className="p-2 text-center whitespace-nowrap">Bookings</th>
                                    <th className="p-2 text-center whitespace-nowrap">KYC Status</th>
                                    <th className="p-2 text-center whitespace-nowrap">Member Since</th>
                                    <th className="p-2 text-center whitespace-nowrap">Action</th>
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
                                            <td className="p-2">{index + 1}</td>
                                            <td className="p-2 text-start">
                                                <UserAvatarCard user={l} />
                                            </td>
                                            <td className="p-2 text-center">
                                                {l?.role === 'customer' ? (
                                                    <a
                                                        href={route('superadmin.booking.list', {
                                                            user_id: l?.id,
                                                            user_type: 'customer'
                                                        })}
                                                    >
                                                        <span className="p-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                                                            {l?.user_booking_count}
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <a
                                                        href={route('superadmin.booking.list', {
                                                            user_id: l?.id,
                                                            user_type: 'mechanic'
                                                        })}
                                                    >
                                                        <span className="p-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                                                            {l?.mechanic_booking_count}
                                                        </span>
                                                    </a>
                                                )}
                                            </td>
                                            <td className="p-2 text-center">{capitalizeWords(l?.kyc_status)}</td>
                                            <td className="p-2 text-center">{l?.member_since}</td>
                                            <td className="p-1 flex justify-center">
                                                <RowActionsMenu>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                            <StatusToggle
                                                                action={route("superadmin.mechanic.update.status", { uuid: l?.uuid })}
                                                                checked={l?.status === 1}
                                                                className="!mb-0"
                                                            />
                                                            <span>Status</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                            <DeleteUserAction
                                                                action={route("superadmin.mechanic.delete", { uuid: l?.uuid || "" })}
                                                                message="Are you sure you want to delete this mechanic?"
                                                            />
                                                            <span>Delete</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                            <Edit user={l} />
                                                            <span>Edit</span>
                                                        </div>
                                                    </div>
                                                </RowActionsMenu>
                                            </td>
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
