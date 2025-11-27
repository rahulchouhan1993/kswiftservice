import React, { useEffect, useState } from 'react'
import logo from '../../img/swiftlogo.png'
import { Link } from '@inertiajs/react'
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        AOS.init();
    }, []);

    const toggleMobileMenu = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mobileOpen) {
                setMobileOpen(false);
            }
        };

        if (mobileOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [mobileOpen]);

    const handleOverlayClick = () => {
        setMobileOpen(false);
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about-us', label: 'About Us' },
        { href: '/our-services', label: 'Services' },
        { href: '/offers', label: 'Offers' },
        { href: '/contact-us', label: 'Contact' },
    ];

    return (
        <div className="fixed top-4 left-0 w-full z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="relative flex items-center justify-between p-3 sm:p-4 rounded-[50px] border border-gray-500 backdrop-blur-[5px] bg-black/20">
                    <div className="flex-shrink-0">
                        <img src={logo} alt="KSwift Logo" className="h-8 w-auto sm:h-9 md:h-10" />
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="font-bold text-gray-300 hover:text-white py-2 px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main rounded"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <button className="hidden md:block px-6 py-2.5 rounded-full bg-main text-white font-medium transition-all duration-300 hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                        Contact
                    </button>

                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2.5 rounded-lg text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                        aria-controls="mobile-menu"
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
                        </svg>
                    </button>
                </header>

                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={handleOverlayClick}
                        aria-hidden="true"
                    />
                )}

                <div
                    id="mobile-menu"
                    className={`md:hidden absolute top-full inset-x-0 z-50 transition-all duration-200 left-[5%] max-w-[90%] ${mobileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                >
                    <div className="rounded-b-xl shadow-lg bg-black border border-gray-500 border-t-0 backdrop-blur-md divide-y divide-gray-700">
                        <nav className="px-4 py-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block font-bold text-gray-300 hover:text-white py-3 px-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main rounded"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile CTA Button */}
                        <div className="px-4 py-4">
                            <button className="w-full px-6 py-3 rounded-full bg-main text-white font-medium transition-all duration-300 hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main">
                                Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
