import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { initTooltips } from "flowbite";
import { useHelpers } from "@/Components/Helpers";
import Pagination from "@/Components/Pagination";
import DataNotExist from "@/Components/DataNotExist";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import UserAvatarCard from "@/Components/UserAvatarCard";
import { MdCloudDownload } from "react-icons/md";
import TextInput from "@/Components/TextInput";

export default function List({ list, search, status, start_date, end_date }) {
    const timerRef = useRef(null);
    const searchRef = useRef(null);
    const { displayInRupee } = useHelpers();

    const statusOptions = [
        { value: "", label: "All" },
        { value: "success", label: "Success" },
        { value: "failed", label: "Failed" },
    ];

    // store date filters in state
    const [dates, setDates] = useState({
        start_date: start_date || "",
        end_date: end_date || ""
    });

    useEffect(() => {
        initTooltips();
        if (searchRef.current) searchRef.current.focus();
    }, []);

    useEffect(() => {
        setDates({
            start_date: start_date || "",
            end_date: end_date || ""
        });
    }, [start_date, end_date]);

    // 🔍 SEARCH
    const handleSearch = (e) => {
        const sval = e.target.value;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.transaction_history.list"), {
                data: {
                    search: sval,
                    status,
                    start_date: dates.start_date,
                    end_date: dates.end_date,
                },
                preserveScroll: true,
            });
        }, 500);
    };

    // 🔄 STATUS FILTER
    const handleStatusChange = (e) => {
        const sval = e.target.value;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.transaction_history.list"), {
                data: {
                    search,
                    status: sval,
                    start_date: dates.start_date,
                    end_date: dates.end_date,
                },
                preserveScroll: true,
            });

        }, 300);
    };

    // 📅 DATE FILTERS
    const handleDateChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setDates((prev) => ({
            ...prev,
            [name]: value
        }));

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            router.visit(route("superadmin.transaction_history.list"), {
                data: {
                    search,
                    status,
                    start_date: name === "start_date" ? value : dates.start_date,
                    end_date: name === "end_date" ? value : dates.end_date,
                },
                preserveScroll: true,
            });

        }, 400);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payment History List" />
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
                            <TextInput
                                id="start_date"
                                type="date"
                                name="start_date"
                                value={dates.start_date}
                                onChange={handleDateChange}
                            />
                        </div>

                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <TextInput
                                id="end_date"
                                type="date"
                                name="end_date"
                                value={dates.end_date}
                                onChange={handleDateChange}
                            />
                        </div>

                        <div className="flex-1 w-full sm:w-auto sm:max-w-[250px]">
                            <input
                                ref={searchRef}
                                defaultValue={search}
                                onKeyUp={handleSearch}
                                type="text"
                                placeholder="Search transaction id..."
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
                                    <th className="p-2 text-start">User</th>
                                    <th className="p-2 text-start">Mechanic</th>
                                    <th className="p-2 text-center">Vehicle</th>
                                    <th className="p-2 text-center">Amount/Mode</th>
                                    <th className="p-2 text-center">Status</th>
                                    <th className="p-2 text-center">Date</th>
                                    <th className="p-2 text-center">Invoice</th>
                                </tr>
                            </thead>

                            <tbody>
                                {list.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-6 text-center text-gray-600 dark:text-gray-300">
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
                                            <td className="p-2">{l?.txnId}</td>

                                            <td className="p-2 text-start">
                                                <UserAvatarCard user={l?.user} />
                                            </td>

                                            <td className="p-2 text-start">
                                                {l?.booking?.mechanic ? (
                                                    <UserAvatarCard user={l?.booking?.mechanic} />
                                                ) : (
                                                    "--"
                                                )}
                                            </td>

                                            <td className="p-2">{l?.booking?.vehicle?.vehicle_number || "--"}</td>

                                            <td className="p-2">
                                                {displayInRupee(l?.amount)} / {l?.payment_mode || "--"}
                                            </td>

                                            <td className="p-2">{l?.status || "--"}</td>

                                            <td className="p-2">{l?.received_at || "--"}</td>

                                            <td className="p-2 flex justify-center">
                                                {l?.invoice_url ? (
                                                    <a
                                                        href={l.invoice_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                    >
                                                        <MdCloudDownload /> Invoice
                                                    </a>
                                                ) : (
                                                    "--"
                                                )}
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
