export default function PrimaryButton({
    className = '',
    disabled,
    children,
    width = 'w-auto', // 🪐 add width prop with default
    padding = 'px-3 py-1.5', // 🪐 add padding prop with default
    ...props
}) {
    return (
        <button
            {...props}
            className={`
                ${width}
                flex items-center gap-2 whitespace-nowrap
                bg-gradient-to-r from-purple-500 to-indigo-600
                text-white text-md font-semibold rounded-md
                shadow-lg hover:shadow-xl
                hover:from-purple-600 hover:to-indigo-700
                transition duration-300 ease-in-out transform
                ${disabled ? 'opacity-25 cursor-not-allowed' : ''}
                ${className}
                ${padding}
            `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
