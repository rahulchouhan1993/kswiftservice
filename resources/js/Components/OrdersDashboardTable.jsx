import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import PrimaryButton from "./PrimaryButton";
import DataNotExist from "./DataNotExist";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from "axios";
import { useHelpers } from "./Helpers";
import PdfDownloadButton from "./PdfDownloadButton";
import ExcelDownloadButton from "./ExcelDownloadButton";

export default function OrdersDashboardTable({ user, fetchRoute }) {
    const { toSentenceCase } = useHelpers();
    
    const rowsPerPage = 20;
    const [menuOpen, setMenuOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get(fetchRoute)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
            })
            .finally(() => setLoading(false));
    }, [fetchRoute]);

    const filteredData = Array.isArray(data) ? data.filter(item => {
        const name = item?.student?.name?.toLowerCase() || "";
        const fatherName = item?.student?.parent?.father_name?.toLowerCase() || "";
        const fatherPhone = item?.student?.parent?.father_phone?.toLowerCase() || "";
        const schoolName = item?.school?.name?.toLowerCase() || "";

        return (
            name.includes(searchTerm.toLowerCase()) ||
            fatherName.includes(searchTerm.toLowerCase()) ||
            fatherPhone.includes(searchTerm.toLowerCase()) ||
            schoolName.includes(searchTerm.toLowerCase())
        );
    }) : [];


    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const displayedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const pdfColumns = [
        "#ID", "Student Name", "Father Name", "Phone", "School Name", "Class", "Order Date", "Student Card", "Parent Card", "Admit Card", "Status"
    ];

    const pdfRows = displayedData.map(item => [
        item.id,
        item.student?.name || '--',
        item.student?.parent?.father_name || '--',
        item.student?.parent?.father_phone || '--',
        item.school?.name || '--',
        `${item.student?.class?.name_withprefix || ''}${item.student?.section ? ` (${item.student.section.name})` : ''}`,
        item?.received_at_short || '--',
        item?.student_card || '--',
        item?.parent_card == 0 ? '--' : item?.parent_card,
        item?.admit_card == 0 ? '--' : item?.admit_card,
        item.status === 'order_created' ? 'Order Created' : item.status === 'work_in_process' ? 'In Process' : item.status || '--'
    ]);

    if (loading) {
        return (
            <div className="p-4 bg-white dark:bg-[#131836] text-white rounded-xl mt-4 shadow-md text-center">
                Loading Orders...
            </div>
        );
    }

    return (
        <div className="sm:p-4 p-1  bg-white dark:bg-[#131836] text-white rounded-xl sm:mt-4 mt-2 shadow-md">
            <div className="flex justify-between items-start lg:items-center sm:mb-4 mb-1 flex-wrap gap-2">
                <div className="hidden md:flex items-center flex-wrap gap-2">
                    <ExcelDownloadButton
                        columns={pdfColumns}
                        data={pdfRows}
                        fileName={`${user?.name}_orders_list`}
                    />

                    <PdfDownloadButton
                        columns={pdfColumns}
                        data={pdfRows}
                        fileName={`${user?.name}_orders_list`}
                        title={`${toSentenceCase(user?.name)} - Order Summary Report`}
                    />
                </div>

                <div className="md:hidden relative">
                    <PrimaryButton onClick={() => setMenuOpen(!menuOpen)} padding='py-2 px-2'>
                        <FaBars size={20} />
                    </PrimaryButton>
                </div>

                <input
                    type="text"
                    className="border text-gray-800 dark:text-white border-gray-600 rounded-lg bg-white dark:bg-[#131836] px-3 py-1.5 flex-1 max-w-xs"
                    placeholder="Search by student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div id="printable-table">
                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full bg-gray-100 text-black dark:bg-[#0a0e25] dark:text-white">
                        <thead className="bg-gray-200 dark:bg-[#0a0e25]">
                            <tr>
                                {['#ID','Student Name', 'School Name', 'Class', 'Order Date', 'Student Card', 'Parent Card', 'Admit Card', 'Status'].map(header => (
                                    <th key={header} className="p-3 text-left font-semibold text-sm whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className=" text-center">
                                        <DataNotExist />
                                    </td>
                                </tr>
                            ) : (
                                displayedData.map((item, index) => (
                                    <tr key={index} className="bg-white text-black hover:bg-gray-100 dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white text-start border-t border-gray-200 dark:border-gray-700">
                                        <td className="p-3 whitespace-nowrap">{item.id}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            <div className="text-sm text-black dark:text-white">{item.student?.name}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                                                Father: {item.student?.parent?.father_name || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                                                Mobile: {item.student?.parent?.father_phone || 'N/A'}
                                            </div>
                                        </td>


                                        <td className="p-3 whitespace-nowrap">{item.school?.name}</td>
                                        <td className="p-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                            {item.student?.class?.name_withprefix}
                                            {item.student?.section ? ` (${item.student.section.name})` : ''}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">{item?.received_at_short}</td>
                                        <td className="p-3 whitespace-nowrap">{item?.student_card}</td>
                                        <td className="p-3 whitespace-nowrap">{item?.parent_card == 0 ? '--' : ''}</td>
                                        <td className="p-3 whitespace-nowrap">{item?.admit_card == 0 ? '--' : ''}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            {item.status === 'order_created' ? (
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">
                                                    Order Created
                                                </span>
                                            ) : item.status === 'work_in_process' ? (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">
                                                    In Process
                                                </span>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </  div>

            <div className="w-full sm:mt-4 mt-2 flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="text-sm px-4 py-2 rounded-md bg-gray-100 dark:bg-[#0a0e36] text-gray-700 dark:text-gray-300 shadow-sm border border-gray-300 dark:border-gray-700">
                    Showing <span className="font-semibold text-black dark:text-white">
                        {((currentPage - 1) * rowsPerPage) + 1}
                    </span> to <span className="font-semibold text-black dark:text-white">
                        {Math.min(currentPage * rowsPerPage, filteredData.length)}
                    </span> of <span className="font-semibold text-black dark:text-white">
                        {filteredData.length}
                    </span> entries
                </div>

                {filteredData.length > rowsPerPage ? (<>
                    <div className="flex items-center justify-end space-x-2">
                        <PrimaryButton
                            className="px-3 py-2 rounded-lg font-medium border shadow bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 dark:border-gray-700 flex items-center"
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        >
                            <IoChevronBack />
                        </PrimaryButton>
                        <span className='text-sm text-black dark:text-white font-medium'>{currentPage} / {totalPages}</span>
                        <PrimaryButton
                            className="px-3 py-2 rounded-lg font-medium border shadow bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 dark:border-gray-700 flex items-center"
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        >
                            <IoChevronForward />
                        </PrimaryButton>
                    </div>
                </>) : ''}
            </div>

        </div>
    );
}
