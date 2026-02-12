import { useAlerts } from '@/Components/Alerts';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { IoLogOut, IoMoon, IoSettingsOutline } from "react-icons/io5";
import { FaSun, FaBell, FaIdCard, FaBars, FaTimes } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import NavDropdown from '@/Components/NavDropdown';
import { MdDashboard, MdOutlineSettingsSuggest } from "react-icons/md";
import Tooltip from '@/Components/Tooltip';
import NotificationPanel from "../../../Components/NotificationPanel";
import { useTheme } from 'next-themes';
import { FaRegRectangleList, FaUsers } from 'react-icons/fa6';
import { LuMessageSquareText } from 'react-icons/lu';
import { GoChecklist } from "react-icons/go";
import { GrFormCalendar, GrUserSettings } from 'react-icons/gr';
import { CiViewList } from 'react-icons/ci';
import { BsChatLeftText, BsReverseListColumnsReverse } from 'react-icons/bs';
import { BiListUl, BiSolidCarMechanic } from 'react-icons/bi';

export default function AuthenticatedLayout({ header, children }) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const [darkMode, setDarkMode] = useState(() =>
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    const { successAlert, errorAlert, warningAlert, infoAlert } = useAlerts();
    const { flash, errors, messages, enquiryCount, newBookingsCount } = usePage().props;

    console.log('newBookingsCount', newBookingsCount);
    console.log('enquiryCount', enquiryCount);

    useEffect(() => {
        if (errors) {
            Object.entries(errors).forEach(([_, value]) => {
                errorAlert(value);
            });
        }
        if (flash?.success) successAlert(flash.success);
        if (flash?.error) errorAlert(flash.error);
        if (flash?.warning) warningAlert(flash.warning);
        if (flash?.info) infoAlert(flash.info);

        if (messages?.envelopes?.length > 0) {
            messages.envelopes.forEach(({ type, message }) => {
                switch (type) {
                    case 'success': successAlert(message); break;
                    case 'error': errorAlert(message); break;
                    case 'warning': warningAlert(message); break;
                    case 'info': infoAlert(message); break;
                }
            });
        }
    }, [messages, flash, errors]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const sampleNotifications = [
        "Your profile was viewed 3 times today.",
        "New message from Admin.",
        "Reminder: Meeting at 3 PM.",
    ];


    // for Resonponsive:
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);


    const navLinks = [
        {
            label: 'Settings',
            icon: IoSettingsOutline,
            dropdown: true,
            items: [
                { label: 'Vehicle Makes', route: 'superadmin.settings.vehicle.make.list' },
                { label: 'Service Types', route: 'superadmin.settings.service.type.list' },
            ]
        },
        {
            label: 'Users',
            icon: FaUsers,
            dropdown: true,
            items: [
                { label: 'Customers', route: 'superadmin.user.list' },
                { label: 'Mechanics', route: 'superadmin.mechanic.list' },
            ]
        },
        {
            href: route('superadmin.enquiries.list'),
            active: route().current('enquiries.list'),
            label: 'Enquiries',
            count: enquiryCount,
            icon: LuMessageSquareText
        },
        { href: route('superadmin.mechanic_job.list'), active: route().current('mechanic_job.list'), label: 'Mechanic Jobs', icon: GrUserSettings },

        {
            href: route('superadmin.booking.list'),
            active: route().current('booking.list'),
            label: 'Bookings',
            count: newBookingsCount,
            icon: GrFormCalendar
        },

        {
            label: 'Transactions',
            icon: BiListUl,
            dropdown: true,
            items: [
                { label: 'Transaction History', route: 'superadmin.transaction_history.list' },
                { label: 'Withdrawal Requests', route: 'superadmin.withdrawal.requests' },
            ]
        },
        { href: route('superadmin.activity_log.list'), active: route().current('activity_log.list'), label: 'Activity Logs', icon: BiListUl },
        { href: route('superadmin.booking.chat.list'), active: route().current('booking.chat.list'), label: 'Chats', icon: BsChatLeftText },
        { href: route('superadmin.ticket.list'), active: route().current('ticket.list'), label: 'Tickets', icon: FaRegRectangleList },
    ];

    return (
        <div className="h-screen dark:bg-[#0a0e25] bg-gray-100">
            <nav className="border-b border-gray-300 dark:border-blue-950 dark:bg-[#0a0e25] bg-white fixed top-0 left-0 right-0 z-50">
                <div className="mx-auto max-w-full px-4 sm:px-5 py-2 ">
                    <div className="flex justify-between ">
                        <div className="flex items-center justify-between md:justify-start w-full bg-white dark:bg-[#0a0e25] relative">
                            <div className='flex items-center gap-2'>
                                <div className="flex items-center justify-center lg:justify-start w-full lg:w-auto">
                                    <Link href={route('superadmin.dashboard')}>
                                        <ApplicationLogo className="block w-auto fill-current text-gray-800 dark:text-gray-200 h-10 " />
                                    </Link>
                                </div>
                            </div>

                            {/* DESKTOP NAV */}
                            <div className="hidden lg:flex items-center space-x-4">
                                {navLinks.map((link, index) =>
                                    link.dropdown ? (
                                        <NavDropdown
                                            key={index}
                                            label={
                                                <span className="flex items-center gap-1">
                                                    <link.icon className="h-5 w-5" />
                                                    {link.label}
                                                </span>
                                            }
                                            items={link.items}
                                        />
                                    ) : (
                                        <NavLink
                                            key={index}
                                            href={link.href}
                                            active={link.active}
                                            count={link.count}
                                        >
                                            <link.icon className="h-5 w-5 mr-1" />
                                            {link.label}
                                        </NavLink>

                                    )
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <NavDropdown
                                label={
                                    <span className='flex items-center gap-2'>
                                        <div className='h-9 w-9 rounded-full border border-white overflow-hidden'>
                                            <img src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740" alt="Profile_Img" className='h-full w-full object-cover' />
                                        </div>
                                    </span>
                                }
                                items={[
                                    { label: 'Profile', route: 'superadmin.update.profile' }
                                ]}
                            />

                            <Tooltip title="Logout">
                                <NavLink
                                    href={route('superadmin.logout')}
                                    method="post"
                                    as="button"
                                    className='flex mt-0 items-center justify-center p-2 w-[34px] dark:hover:bg-blue-950 hover:bg-gray-300 rounded-full'
                                >
                                    <IoLogOut className='h-5 w-5 dark:text-white text-black' />
                                </NavLink>
                            </Tooltip>

                            <Tooltip title="Mode">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="flex items-center justify-center p-2 dark:hover:bg-blue-950 hover:bg-gray-300 rounded-full"
                                >
                                    {darkMode ? (
                                        <FaSun size={19} className="text-gray-200" />
                                    ) : (
                                        <IoMoon size={18} className="text-gray-800" />
                                    )}
                                </button>
                            </Tooltip>

                            <Tooltip title="Setting">
                                <Link href="#" className='flex items-center justify-center p-2 dark:hover:bg-blue-950 hover:bg-gray-300 rounded-full'>
                                    <IoSettings className='h-5 w-5' />
                                </Link>
                            </Tooltip>

                            <div className="lg:hidden flex items-center">
                                <button onClick={() => setMenuOpen(!menuOpen)} className='rounded-md p-2' >
                                    {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                                </button>
                            </div>

                            {menuOpen && (
                                <div
                                    ref={menuRef}
                                    className="absolute top-[50px] right-[10px] w-auto bg-white dark:bg-[#131836] shadow-lg  z-50 rounded-b-lg  flex flex-col border border-gray-300 dark:border-blue-900"
                                >
                                    {navLinks.map((link, index) => (
                                        <NavLink
                                            key={index}
                                            href={link.href}
                                            active={link.active}
                                            className="flex items-center px-4 py-2 hover:bg-white dark:hover:bg-[#131836] transition"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <link.icon className="h-5 w-5 mr-2" /> {link.label}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800 mt-16">
                    <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )
            }

            <main>{children}</main>
            <Toaster position='top-right' reverseOrder={false} gutter={8} />
            <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={sampleNotifications}
            />
        </div>
    );
}
