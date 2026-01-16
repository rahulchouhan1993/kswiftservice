import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from "react"
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import DataNotExist from '@/Components/DataNotExist';
import { FaRupeeSign, FaUsers } from 'react-icons/fa6';
import { useHelpers } from '@/Components/Helpers';
import UserAvatarCard from '@/Components/UserAvatarCard';
import Pagination from '@/Components/Pagination';
import ActivityLogMessage from './ActivityLogMessage';
import VehicleInfo from '@/Components/VehicleInfo';
import RowActionsMenu from '@/Components/RowActionsMenu';
import BookingDetails from './Bookings/BookingDetails';
import AuthenticatedLayout from './Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { GiHomeGarage, GiMechanicGarage } from 'react-icons/gi';
import { BiRupee, BiSolidCarGarage } from 'react-icons/bi';
import { MdFreeCancellation, MdMarkUnreadChatAlt } from 'react-icons/md';
import DashboardStatsBarChart from '@/Components/DashboardStatsBarChart';
const rowsPerPage = 5;

export default function Dashboard({ customers, mechanics, bookings, newMessages, injobs, completedjobs, cancelledjobs, newMessagesData, activity_logs, active_bookings, total_revenue, reports, selectedYear, availableYears, }) {
    console.log('completedjobs', completedjobs);
    const { capitalizeWords, displayInRupee, replaceUnderscoreWithSpace } = useHelpers();

    const barData = useMemo(() => ([
        { value: 30 }, { value: 50 }, { value: 40 },
        { value: 60 }, { value: 45 }
    ]), []);


    const badgeBase = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize";
    const bookingBadge = (status) => {
        const colors = {
            requested: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
            accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        };

        return <span className={`${badgeBase} ${colors[status] || "bg-gray-200 text-gray-700"}`}>{status}</span>;
    };

    const paymentBadge = (status) => {
        const colors = {
            success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        };

        return <span className={`${badgeBase} ${colors[status]}`}>{status}</span>;
    };

    return (

        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="pt-[57px]">
                {/* <AuthInfo /> */}
                <div>
                    <div className="min-h-screen dark:bg-[#0a0e25] bg-gray-100 text-white p-2 sm:p-4 md:p-6">
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 items-stretch'>
                            <div className='w-full h-full flex flex-col  sm:p-4 p-0 sm:bg-white sm:dark:bg-[#131836] rounded-xl relative overflow-hidden shadow-md'>
                                <div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">

                                    <StatCard
                                        title="Total Revenue"
                                        value={displayInRupee(total_revenue)}
                                        icon={BiRupee}
                                        href="#"
                                        color="indigo"
                                        chart={
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={barData}>
                                                    <Bar dataKey="value" fill="#52c5fa" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        }
                                    />

                                    <StatCard
                                        title="Customers"
                                        value={customers}
                                        icon={FaUsers}
                                        href={route('superadmin.user.list')}
                                        color="indigo"
                                    />

                                    <StatCard
                                        title="Mechanics"
                                        value={mechanics}
                                        icon={GiMechanicGarage}
                                        href={route('superadmin.mechanic.list')}
                                        color="indigo"
                                    />

                                    <StatCard
                                        title="Active Jobs"
                                        value={injobs}
                                        icon={BiSolidCarGarage}
                                        href={route('superadmin.mechanic_job.list')}
                                        color="indigo"
                                    />

                                    <StatCard
                                        title="Completed Jobs"
                                        value={completedjobs}
                                        icon={GiHomeGarage}
                                        href={route('superadmin.mechanic_job.list')}
                                        color="indigo"
                                    />

                                    <StatCard
                                        title="Cancelled Jobs"
                                        value={cancelledjobs}
                                        icon={MdFreeCancellation}
                                        href={route('superadmin.mechanic_job.list')}
                                        color="indigo"
                                    />

                                    <StatCard
                                        title="New Messages"
                                        value={newMessages}
                                        icon={MdMarkUnreadChatAlt}
                                        href={route('superadmin.enquiries.list')}
                                        color="indigo"
                                    />
                                </div>
                            </div>

                            <div className="w-full h-full flex flex-col sm:p-4 p-0 sm:bg-white sm:dark:bg-[#131836] rounded-xl shadow-md">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                                        Revenue Report
                                    </h2>

                                    <select
                                        value={selectedYear}
                                        onChange={(e) =>
                                            router.get(
                                                route("superadmin.dashboard"),
                                                { year: e.target.value },
                                                { preserveState: true, preserveScroll: true }
                                            )
                                        }
                                        className="border rounded-md px-3 py-1 text-sm bg-white dark:bg-[#0a0e25] text-gray-800 dark:text-white w-[100px]"
                                    >
                                        {availableYears.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <DashboardStatsBarChart reports={reports} />
                            </div>

                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 items-stretch my-3'>
                            <div className='w-full h-full flex flex-col  sm:p-4 p-0 sm:bg-white sm:dark:bg-[#131836] rounded-xl relative overflow-hidden shadow-md'>
                                <div className="w-full md:w-auto">
                                    <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                        Activity Logs
                                    </h2>
                                </div>
                                <table className=" min-w-full bg-gray-100 text-black  dark:bg-[#0a0e25] dark:text-white my-2">
                                    <thead className="border-b border-gray-300 dark:border-blue-900 ">
                                        <tr>
                                            <th className="p-2 text-start whitespace-nowrap">SNo.</th>
                                            <th className="p-2 text-start whitespace-nowrap">User</th>
                                            <th className="p-2 text-start whitespace-nowrap">Title</th>
                                            <th className="p-2 text-start whitespace-nowrap">Date</th>
                                            <th className="p-2 text-start whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {activity_logs.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="text-center py-6 text-gray-600 dark:text-gray-300"
                                                >
                                                    <DataNotExist />
                                                </td>
                                            </tr>
                                        ) : (
                                            activity_logs.data.map((l, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-white text-black hover:bg-gray-100 dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white"
                                                >
                                                    <td className="p-2 text-sm">{index + 1}</td>
                                                    <td className="p-2 text-sm">
                                                        {l?.user ? (
                                                            <UserAvatarCard user={l?.user} />
                                                        ) : (
                                                            "--"
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-sm">{capitalizeWords(l?.title)}</td>
                                                    <td className="p-2 text-sm">{l?.received_at || '--'}</td>
                                                    <td className="p-2 text-sm">
                                                        <RowActionsMenu>
                                                            <div className="flex flex-col gap-1">
                                                                <ActivityLogMessage log={l} />
                                                            </div>
                                                        </RowActionsMenu>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                </table>
                                {activity_logs.total > 0 && activity_logs.last_page > 1 && (
                                    <Pagination paginate={activity_logs} />
                                )}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 items-stretch my-2'>
                            <div className='w-full h-full flex flex-col  sm:p-4 p-0 sm:bg-white sm:dark:bg-[#131836] rounded-xl relative overflow-hidden shadow-md'>
                                <div className="w-full md:w-auto">
                                    <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                        Active Bookings
                                    </h2>
                                </div>
                                <table className=" min-w-full bg-gray-100 text-black  dark:bg-[#0a0e25] dark:text-white my-2">
                                    <thead className="border-b border-gray-300 dark:border-blue-900 ">
                                        <tr>
                                            <th className="p-2 text-start whitespace-nowrap">Booking ID</th>
                                            <th className="p-2 text-start whitespace-nowrap">Customer</th>
                                            <th className="p-2 text-start whitespace-nowrap">Mechanic</th>
                                            <th className="p-2 text-start whitespace-nowrap">Assigned Date</th>
                                            <th className="p-2 text-start whitespace-nowrap">Delivery Date</th>
                                            <th className="p-2 text-start whitespace-nowrap">Vehicle</th>
                                            <th className="p-2 text-start whitespace-nowrap">Payment</th>
                                            <th className="p-2 text-start whitespace-nowrap">Status</th>
                                            <th className="p-2 text-start whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {active_bookings.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={9}
                                                    className="text-center py-6 text-gray-600 dark:text-gray-300"
                                                >
                                                    <DataNotExist />
                                                </td>
                                            </tr>
                                        ) : (
                                            active_bookings.data.map((l, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-white text-black hover:bg-gray-100 dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white"
                                                >
                                                    <td className="p-2 text-sm">{l?.booking_id}</td>
                                                    <td className="p-2 text-sm">
                                                        {l?.customer ? (
                                                            <UserAvatarCard user={l?.customer} />
                                                        ) : (
                                                            "--"
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-sm">
                                                        {l?.mechanic ? (
                                                            <UserAvatarCard user={l?.mechanic} />
                                                        ) : (
                                                            "--"
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-sm">{l?.assigned_at || '--'}</td>
                                                    <td className="p-2 text-sm">{l?.delivered_at || '--'}</td>
                                                    <td className="p-2 text-sm">
                                                        <VehicleInfo vehicle={l?.vehicle} />
                                                    </td>

                                                    <td className="px-3 py-2 text-center">
                                                        {paymentBadge(l.payment?.status || "pending")}
                                                    </td>

                                                    <td className="px-3 py-2 text-center">
                                                        {bookingBadge(replaceUnderscoreWithSpace(l.booking_status))}
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <RowActionsMenu>
                                                            <div className="flex flex-col gap-1">
                                                                <BookingDetails booking={l} />
                                                            </div>
                                                        </RowActionsMenu>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                </table>
                                {active_bookings.total > 0 && active_bookings.last_page > 1 && (
                                    <Pagination paginate={active_bookings} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
