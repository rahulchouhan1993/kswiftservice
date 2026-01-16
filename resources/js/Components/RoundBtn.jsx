export default function RoundBtn({ children, className = "", ...props }) {
    return (
        <button
            {...props}
            className={`
                flex items-center gap-2
                w-full px-2 py-1.5
                rounded-md
                text-xs font-medium

                /* Default */
                text-[#08365C] dark:text-[#52C5FA]

                /* Hover */
                hover:text-white
                hover:bg-gradient-to-r
                hover:from-[#08365C]
                hover:to-[#52C5FA]

                /* Dark mode */
                dark:hover:text-white

                transition duration-200
                ${className}
            `}
        >
            {children}
        </button>
    );
}
