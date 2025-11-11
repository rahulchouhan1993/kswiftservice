import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PrimaryButton from './PrimaryButton';
import { useHelpers } from './Helpers';

export default function ExcelDownloadButton({ columns, data, fileName }) {
    const { toSentenceCase } = useHelpers();

    const handleExcelDownload = () => {
        const now = new Date();
        const filenameDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '');

        const exportData = data.map(row =>
            columns.reduce((obj, col, index) => {
                obj[col] = row[index] || '--';
                return obj;
            }, {})
        );

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

        const safeName = toSentenceCase(fileName || 'Report').replace(/\s+/g, '_');
        saveAs(dataBlob, `${safeName}-${filenameDate}.xlsx`);
    };

    return <PrimaryButton onClick={handleExcelDownload}>Excel</PrimaryButton>;
}
