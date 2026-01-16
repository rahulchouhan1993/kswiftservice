import { HiOutlineDownload } from "react-icons/hi";

export default function LinkPdfDownloadButton({
    url,
    label = "Download PDF",
    className = "",
    onDownloaded,
}) {
    if (!url) return null;

    const handleDownload = (e) => {
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
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleDownload}
            className={`
                inline-flex items-center gap-2
                px-3 py-1.5 text-xs font-semibold
                rounded-md

                /* Brand Gradient */
                bg-gradient-to-r
                from-[#08365C]
                to-[#52C5FA]
                text-white

                /* Hover */
                hover:from-[#062A47]
                hover:to-[#3BB9F5]

                transition duration-200
                ${className}
            `}
        >
            <HiOutlineDownload size={14} />
            {label}
        </button>
    );
}
