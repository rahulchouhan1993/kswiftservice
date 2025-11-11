import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center mt-1 text-sm font-medium px-1  transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? ' text-black   dark:text-white'
                    : ' text-black   dark:text-white  hover:text-blue-600 dark:hover:text-blue-600  ') +
                className
            }
        >
            {children}
        </Link>
    );
}
