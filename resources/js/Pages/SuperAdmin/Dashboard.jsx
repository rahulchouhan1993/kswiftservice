import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from "react"
import { FaFacebook, FaTwitter, FaTiktok, FaInstagram, FaSnapchat, FaGift, FaEllipsisV, FaStar } from "react-icons/fa"
import { LineChart, Line, BarChart, Bar, YAxis, XAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, CartesianGrid } from "recharts";
import { SlCalender } from "react-icons/sl";
import AuthenticatedLayout from './Layouts/AuthenticatedLayout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import DataNotExist from '@/Components/DataNotExist';
import { FaUserGraduate, FaTasks, FaClipboardList, FaFileAlt } from 'react-icons/fa';
import HoverActionTooltip from '@/Components/HoverActionTooltip';
import { HamburgerIcon } from 'lucide-react';
import { FaBars } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaUsers } from 'react-icons/fa6';
import { GrUserSettings } from 'react-icons/gr';
const rowsPerPage = 5;

export default function Dashboard({ customers, mechanics, bookings, newMessages, injobs, completedjobs, cancelledjobs, newMessagesData }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("monthly");

    const handlePdfDownload = () => {
        const doc = new jsPDF();
        const tableColumn = ['Name', 'Email', 'Phone', 'Message', 'Date'];
        const tableRows = filteredData.map(item => [
            item.name,
            item.email,
            item.phone,
            item.message,
            item.received_at,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
        });

        doc.save("table-data.pdf");
    };

    // Sample data for charts
    const ordersData = [
        { value: 30 },
        { value: 40 },
        { value: 35 },
        { value: 50 },
        { value: 45 },
        { value: 60 },
        { value: 55 },
        { value: 65 },
    ]

    const layoutData = [
        { name: 'A', value: 30 },
        { name: 'B', value: 40 },
        { name: 'C', value: 50 },
        { name: 'D', value: 35 },
        { name: 'E', value: 45 },
        { name: 'F', value: 25 },
        { name: 'G', value: 55 },
        { name: 'H', value: 5 },
    ];

    // for data table:
    const data = newMessagesData;

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const displayedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // This is for time module
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);


    return (

        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="pt-[57px]">
                {/* <AuthInfo /> */}
                <div>
                    <div className="min-h-screen dark:bg-[#0a0e25] bg-gray-100 text-white p-2 sm:p-4 md:p-6">
                        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 items-stretch'>
                            <div className='w-full h-full flex flex-col  sm:p-4 p-0 sm:bg-white sm:dark:bg-[#131836] rounded-xl relative overflow-hidden shadow-md'>
                                <div className="h-full grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">

                                    <Link href={route('superadmin.user.list')}>
                                        <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{customers}</h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Customers</span>
                                                </div>
                                                <div className="absolute right-2 top-2 bg-gradient-to-br from-pink-500 to-red-500 p-3 rounded-lg">
                                                    <FaUsers className="text-white text-xl" />
                                                </div>
                                            </div>

                                            <div className="h-16 mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={layoutData}>
                                                        <Bar dataKey="value">
                                                            {layoutData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>

                                            </div>
                                        </div>
                                    </Link>


                                    <Link href={route('superadmin.user.list')}>
                                        <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{mechanics}</h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Mechanics</span>
                                                </div>
                                                <div className="absolute right-2 top-2 bg-gradient-to-br from-blue-500 to-blue-500 p-3 rounded-lg">
                                                    <GrUserSettings className="text-white text-xl" />
                                                </div>
                                            </div>
                                            <div className="h-16 mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={ordersData}>
                                                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Link>


                                    <Link href={route('superadmin.booking.list')}>
                                        <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{bookings}</h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Bookings</span>
                                                </div>
                                                <div className="absolute right-2 top-2 bg-gradient-to-br from-yellow-500 to-yellow-500 p-3 rounded-lg">
                                                    <SlCalender className="text-white text-xl" />
                                                </div>
                                            </div>
                                            <div className="h-16 mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={ordersData}>
                                                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href={route('superadmin.mechanic_job.list')}>
                                        <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{injobs}</h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total In Jobs</span>
                                                </div>
                                                <div className="absolute right-2 top-2 bg-gradient-to-br from-yellow-500 to-yellow-500 p-3 rounded-lg">
                                                    <SlCalender className="text-white text-xl" />
                                                </div>
                                            </div>
                                            <div className="h-16 mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={ordersData}>
                                                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href={route('superadmin.mechanic_job.list')}>
                                        <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{completedjobs}</h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Completed Jobs</span>
                                                </div>
                                                <div className="absolute right-2 top-2 bg-gradient-to-br from-yellow-500 to-yellow-500 p-3 rounded-lg">
                                                    <SlCalender className="text-white text-xl" />
                                                </div>
                                            </div>
                                            <div className="h-16 mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={ordersData}>
                                                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href={route('superadmin.mechanic_job.list')}>
                                        <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{cancelledjobs}</h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Cancelled Jobs</span>
                                                </div>
                                                <div className="absolute right-2 top-2 bg-gradient-to-br from-yellow-500 to-yellow-500 p-3 rounded-lg">
                                                    <SlCalender className="text-white text-xl" />
                                                </div>
                                            </div>
                                            <div className="h-16 mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={ordersData}>
                                                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href={route('superadmin.enquiries.list')}>
                                        <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{newMessages}</h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">New Enquiry Messages</span>
                                                </div>
                                                <div className="absolute right-2 top-2 bg-gradient-to-br from-yellow-500 to-yellow-500 p-3 rounded-lg">
                                                    <SlCalender className="text-white text-xl" />
                                                </div>
                                            </div>
                                            <div className="h-16 mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={ordersData}>
                                                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white dark:bg-[#131836] text-white rounded-xl mt-4 shadow-md">
                            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                                <div className="w-full md:w-auto">
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                        New Enquiries
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap justify-end w-full md:w-auto">
                                    <div className="min-w-[200px] max-w-xs">
                                        <input
                                            type="text"
                                            className="w-full border text-gray-800 dark:text-white border-gray-600 rounded-lg bg-white dark:bg-[#131836] px-3 py-1.5"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="hidden md:flex items-center flex-wrap gap-2">
                                        <PrimaryButton onClick={handlePdfDownload}>PDF</PrimaryButton>
                                    </div>

                                    <div className="md:hidden relative">
                                        <PrimaryButton onClick={() => setMenuOpen(!menuOpen)} padding="py-2 px-2">
                                            <FaBars size={20} />
                                        </PrimaryButton>

                                        {menuOpen && (
                                            <div className="absolute right-0 mt-2 z-50 bg-white dark:bg-[#1f2937] rounded-lg shadow-lg p-2 flex flex-col gap-2 w-40">
                                                <PrimaryButton onClick={() => { handleExcelDownload(); setMenuOpen(false); }}>Excel</PrimaryButton>
                                                <PrimaryButton onClick={() => { handlePdfDownload(); setMenuOpen(false); }}>PDF</PrimaryButton>
                                                <PrimaryButton onClick={() => { handleCopy(); setMenuOpen(false); }}>Copy</PrimaryButton>
                                                <PrimaryButton onClick={() => { handlePrint(); setMenuOpen(false); }}>Print</PrimaryButton>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div id="printable-table">
                                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                    <table className="min-w-full bg-gray-100 text-black dark:bg-[#0a0e25] dark:text-white">
                                        <thead className="bg-gray-200 dark:bg-[#0a0e25]">
                                            <tr>
                                                {['Name', 'Email', 'Phone', 'Message', 'Date'].map(header => (
                                                    <th
                                                        key={header}
                                                        className="p-3 text-left font-semibold text-sm whitespace-nowrap"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="p-4 text-center">
                                                        <DataNotExist />
                                                    </td>
                                                </tr>
                                            ) : (
                                                displayedData.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="bg-white text-black hover:bg-gray-100 dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white text-start border-t border-gray-200 dark:border-gray-700"
                                                    >
                                                        <td className="p-3 whitespace-nowrap">{item.name}</td>
                                                        <td className="p-3 whitespace-nowrap">{item.email}</td>
                                                        <td className="p-3 whitespace-nowrap">{item.phone}</td>
                                                        <td className="p-3 whitespace-normal break-words">{item.message}</td>
                                                        <td className="p-3 whitespace-nowrap">{item.received_at}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            <div className="w-full mt-2 flex  md:flex-row flex-col">
                                <span className='dark:text-gray-300 text-black' >Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries</span>
                                <div className="w-full flex items-center justify-end whitespace-nowrap mt-2">
                                    <PrimaryButton className="px-2 py-2 rounded-lg font-medium border shadow transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 dark:border-gray-700 flex items-center justify-start" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}><IoChevronBack /> </PrimaryButton>
                                    <span className='dark:text-white text-black mx-2'>{currentPage} / {totalPages}</span>
                                    <PrimaryButton className="px-2 py-2 rounded-lg font-medium border shadow transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 dark:border-gray-700 flex items-center justify-start" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}> <IoChevronForward /></PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
