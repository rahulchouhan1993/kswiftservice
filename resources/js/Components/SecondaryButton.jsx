export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    padding = 'px-3 py-1.5',
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `px-3 py-1.5 whitespace-nowrap flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-md font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-pink-600 transition duration-300 ease-in-out ${
                    disabled && 'opacity-25' 
                } ` + className
                
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
