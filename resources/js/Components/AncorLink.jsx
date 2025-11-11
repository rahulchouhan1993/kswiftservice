export default function AncorLink({
    className = "",
    disabled = false,
    children,
    width = "w-auto",
    padding = "p-2",
    href = "#",
    ...props
}) {
    return (
        <a
            href={disabled ? undefined : href}
            {...props}
            className={`
                ${width}
                flex items-center gap-x-1 
                bg-gradient-to-r from-purple-500 to-indigo-600
                text-white text-md font-semibold rounded-lg
                shadow-lg hover:shadow-xl
                hover:from-purple-600 hover:to-indigo-700
                transition duration-300 ease-in-out transform  h-[36px]
                ${
                    disabled
                        ? "opacity-50 pointer-events-none cursor-not-allowed"
                        : ""
                }
                ${className}
                ${padding}
            `}
        >
            {children}
        </a>
    );
}
