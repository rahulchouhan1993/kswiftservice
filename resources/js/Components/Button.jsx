export default function Button({
    type = "button",
    className = '',
    disabled = false,
    children,
    bgColor = 'bg-blue-700',
    hoverBgColor = 'hover:bg-blue-800',
    textColor = 'text-white',
    ringColor = 'focus:ring-blue-300',
    darkBgColor = 'dark:bg-blue-600',
    darkHoverBgColor = 'dark:hover:bg-blue-700',
    darkRingColor = 'dark:focus:ring-blue-800',
    padding = 'p-2.5',
    size = 'w-7 h-7', // or custom like 'w-8 h-8'
    icon = null, // pass a JSX icon
    srText = '', // for screen reader description
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            {...props}
            className={`
                inline-flex items-center justify-center text-sm font-medium rounded text-center me-2
                focus:outline-none focus:ring-4
                ${size} ${bgColor} ${hoverBgColor} ${textColor} ${ringColor}
                ${darkBgColor} ${darkHoverBgColor} ${darkRingColor} ${padding}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            {icon && (
                <span className="w-4 h-4 mr-1">
                    {icon}
                </span>
            )}
            {children}
            {srText && <span className="sr-only">{srText}</span>}
        </button>
    );
}
