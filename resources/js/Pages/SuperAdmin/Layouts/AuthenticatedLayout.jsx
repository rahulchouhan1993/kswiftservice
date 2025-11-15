import { useAlerts } from '@/Components/Alerts';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { IoLogOut, IoMoon } from "react-icons/io5";
import { FaSun, FaBell, FaIdCard, FaBars, FaTimes } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import NavDropdown from '@/Components/NavDropdown';
import { MdDashboard, MdOutlineSettingsSuggest } from "react-icons/md";
import Tooltip from '@/Components/Tooltip';
import NotificationPanel from "../../../Components/NotificationPanel";
import { useTheme } from 'next-themes';
import { FaUsers } from 'react-icons/fa6';

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
    const { flash, errors, messages } = usePage().props;

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
        { href: route('superadmin.dashboard'), active: route().current('dashboard'), label: 'Dashboard', icon: MdDashboard },
        { href: route('superadmin.settings.vehicle.make.list'), active: route().current('vehicle.make'), label: 'Settings', icon: MdOutlineSettingsSuggest },
        { href: route('superadmin.user.list'), active: route().current('user.list'), label: 'Users', icon: FaUsers }
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

                            <div className="hidden lg:flex items-center space-x-4 ms-5">
                                {navLinks.map((link, index) => (
                                    <NavLink key={index} href={link.href} active={link.active}>
                                        <link.icon className="h-5 w-5 mr-1" /> {link.label}
                                    </NavLink>
                                ))}
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
                                    { label: 'Profile', route: null }
                                ]}
                            />

                            <Tooltip title="Notification">
                                <div onClick={() => setIsNotificationOpen(true)} className='flex items-center justify-center p-2 dark:hover:bg-blue-950 hover:bg-gray-300 rounded-full cursor-pointer'>
                                    <FaBell className='h-5 w-5 dark:text-white text-black' />
                                </div>
                            </Tooltip>

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
