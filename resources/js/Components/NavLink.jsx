import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    count = 0,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`
                relative inline-flex items-center mt-1
                text-sm font-medium px-1
                transition duration-150 ease-in-out
                ${active
                    ? 'text-black dark:text-white'
                    : 'text-black dark:text-white hover:text-[#52C5FA]'
                }
                ${className}
            `}
        >
            {children}

            {/* 🔵 BRAND GRADIENT BADGE */}
            {Number(count) > 0 && (
                <span
                    className="
                        ml-2 min-w-[18px] h-[18px]
                        px-1 text-[10px] font-bold
                        flex items-center justify-center
                        rounded-full
                        text-white
                        bg-gradient-to-r
                        from-[#08365C]
                        to-[#52C5FA]
                    "
                >
                    {count}
                </span>
            )}
        </Link>
    );
}
