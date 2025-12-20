import { HiOutlineDownload } from "react-icons/hi";

export default function LinkPdfDownloadButton({
    url,
    label = "Download PDF",
    className = "",
    onDownloaded,
}) {
    if (!url) return null;

    const handleDownload = (e) => {
        // 🔥 prevent modal / dropdown auto-close
        e.preventDefault();
        e.stopPropagation();

        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", "");
        a.target = "_blank";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (typeof onDownloaded === "function") {
            onDownloaded();
        }
    };

    return (
        <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()} // 🔥 critical
            onClick={handleDownload}
            className={`inline-flex items-center gap-2
                        px-3 py-1.5 text-xs font-semibold
                        rounded-md bg-blue-600 text-white
                        hover:bg-blue-700 transition
                        ${className}`}
        >
            <HiOutlineDownload size={14} />
            {label}
        </button>
    );
}
