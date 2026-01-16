export default function PrimaryButton({
    className = '',
    disabled,
    children,
    width = 'w-auto',
    padding = 'px-3 py-1.5',
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`
                ${width}
                flex items-center gap-2 whitespace-nowrap
                bg-gradient-to-r
                from-[#08365C] to-[#52C5FA]
                text-white text-md font-semibold rounded-md
                shadow-lg hover:shadow-xl
                hover:from-[#062A47] hover:to-[#3BB9F5]
                transition duration-300 ease-in-out transform
                ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
                ${padding}
                ${className}
            `}
        >
            {children}
        </button>
    );
}
