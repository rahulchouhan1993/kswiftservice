export default function EditBtn({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`
                w-8 h-8 rounded-full p-2
                border border-gray-200
                flex items-center justify-center
                transition duration-200

                /* Default */
                text-[#52C5FA]
                hover:text-white
                hover:bg-gradient-to-r
                hover:from-[#08365C]
                hover:to-[#52C5FA]

                /* Dark mode */
                dark:border-gray-600
                dark:text-[#52C5FA]
                dark:hover:bg-gradient-to-r
                dark:hover:from-[#08365C]
                dark:hover:to-[#52C5FA]
                dark:hover:text-white

                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            {children}
        </button>
    );
}
