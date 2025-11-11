import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function NavDropdown({ label = "More", items = [] }) {
    const [openMenu, setOpenMenu] = useState(false);

    const handleMouseEnter = () => setOpenMenu(true);
    const handleMouseLeave = () => setOpenMenu(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <DropdownMenu open={openMenu} onOpenChange={() => { }}>
                <DropdownMenuTrigger asChild>
                    <button
                        className={
                            'flex items-center hover:text-blue-600 dark:hover:text-blue-600  px-1  text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                            (openMenu
                                ? ' text-black   dark:text-white'
                                : ' text-black   dark:text-white ')
                        }
                    >
                        {label} 
                    </button> 
                </DropdownMenuTrigger>

                <DropdownMenuContent className=" absolute left-0 top-full z-50 bg-white dark:bg-[#131836] border border-blue-200 dark:border-blue-900 shadow-md">
                    <DropdownMenuSeparator />
                    {items.map((item, index) => (
                        <DropdownMenuItem key={index}>
                            {item.route ? (
                                <Link
                                    href={route(item.route)}
                                    className="w-full block text-sm text-gray-700 dark:text-white py-2 px-3   hover:bg-gray-100 dark:hover:bg-blue-950"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="w-full block text-sm text-gray-400 dark:text-gray-500 px-2 py-1 cursor-not-allowed">
                                    {item.label}
                                </span>
                            )}
                        </DropdownMenuItem>
                    ))}

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
