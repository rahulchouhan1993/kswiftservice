import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PrimaryButton from './PrimaryButton';
import { useHelpers } from './Helpers';

export default function PdfDownloadButton({ columns, data, fileName, title = "Report" }) {
    const { toSentenceCase } = useHelpers();

    const handlePdfDownload = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
        const filenameDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '');

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${title} - ${formattedDate}`, doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });

        autoTable(doc, {
            head: [columns],
            body: data,
            startY: 12,
            styles: { fontSize: 8 },
            margin: { top: 5, left: 5, right: 5, bottom: 5 },
            headStyles: {
                fillColor: [133, 79, 240],
                textColor: 255,
                halign: 'center',
            },
            bodyStyles: {
                halign: 'left',
            },
        });

        const safeName = toSentenceCase(fileName || 'Report').replace(/\s+/g, '_');
        doc.save(`${safeName}-${filenameDate}.pdf`);
    };

    return <PrimaryButton onClick={handlePdfDownload}>PDF</PrimaryButton>;
}
