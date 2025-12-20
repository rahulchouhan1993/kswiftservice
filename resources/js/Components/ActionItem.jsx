export default function ActionItem({ onClick, children, danger = false }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2
                        text-sm rounded-md transition text-left
                        hover:bg-gray-100 dark:hover:bg-[#1a1f4a]
                        ${danger ? "text-red-600 dark:text-red-400" : ""}`}
        >
            {children}
        </button>
    );
}
