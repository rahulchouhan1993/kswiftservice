export default function RoundBtn({
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
                w-8 h-8 border rounded-full p-2 transition duration-150
                text-blue-600 hover:text-white bg-transparent hover:bg-blue-600
                dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-700
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            {children}
        </button>
    );
}
