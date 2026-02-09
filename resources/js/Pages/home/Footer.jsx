import React from 'react';
import { Link, router } from '@inertiajs/react';
import logo from '../../img/swiftlogo.png'
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    const phone = "918747998747";
    const encodedMessage = encodeURIComponent("Hi there, I would like to request for service, can you help me out?!");
    const waLink = `https://wa.me/${phone}?text=${encodedMessage}`;
    const scrollToSection = (sectionId) => {
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleNavigation = (path, sectionId) => {
        router.visit(path);
        setTimeout(() => {
            scrollToSection(sectionId);
        }, 100);
        setMobileOpen(false)
    };


    return (
        <footer className="bg-black text-white   pt-4 md:pt-12 lg:pt-16 pb-16">
            <div className="container mx-auto px-6">
                {/* Main Footer Container */}
                <div className="rounded-2xl !p-[1px] mb-8 bg-gradient-to-r from-gray-500 to-gray-900">
                    <div className="rounded-2xl bg-black p-6 sm:p-8 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">

                            {/* Left Column - Brand and Social */}
                            <div className="space-y-6">
                                <div>
                                    <div className="flex-shrink-0 flex flex-col items-start">
                                        <img src={logo} alt="KSwift Logo" className="max-w-[100px] w-full ps-4" />
                                        {/* <span className="text-[13px] font-bold text-white mt-1">
                                            Powered By K Vidya Gupta
                                        </span> */}
                                    </div>
                                    <div className='social_links mt-4'>
                                        <ul className='flex space-x-2 ps-2 mt-2'>
                                            <li><a className=' fading w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors' href='#'><FaInstagram size='20' /></a></li>
                                            <li><a className=' fading w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors' href='#'><FaTwitter size='20' /></a></li>
                                            <li><a href={waLink}
                                                target="_blank"
                                                rel="noreferrer" className=' fading w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors'><IoLogoWhatsapp size='20' /></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Second Column - Quick Links */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold tracking-wide uppercase text-sm">{t('footer.quick_links.title', 'Quick Links')}</h3>
                                <ul className="space-y-3">
                                    <li><button onClick={() => handleNavigation('/', '#why-choose-us')} className="fading text-gray-300 hover:text-white transition-colors">{t('footer.quick_links.why_us', 'Why choose us')}</button></li>
                                    <li><Link href="/about-us" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.quick_links.about', 'About')}</Link></li>
                                    <li><Link href="/contact-us" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.quick_links.contact', 'Contact')}</Link></li>
                                </ul>
                            </div>

                            {/* Third Column - For Customers */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold tracking-wide uppercase text-sm">{t('footer.for_customers.title', 'For Customers')}</h3>
                                <ul className="space-y-3">
                                    <li><button onClick={() => handleNavigation('/', '#services')} className="fading text-gray-300 hover:text-white transition-colors">{t('footer.for_customers.services', 'Services')}</button></li>
                                    <li><a href="https://play.google.com/store/apps/details?id=com.kswiftservice&pcampaignid=web_share" target="_blank" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.for_customers.download_app', 'Download our app')}</a></li>
                                    <li><button onClick={() => handleNavigation('/', '#faq')} className="fading text-gray-300 hover:text-white transition-colors">{t('footer.for_customers.faqs', 'FAQs')}</button></li>
                                    <li><Link href="/customer-terms-conditions" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.for_customers.terms', 'Customer Terms & Conditions')}</Link></li>
                                </ul>
                            </div>

                            {/* Fourth Column - For Partners */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold tracking-wide uppercase text-sm">{t('footer.for_partners.title', 'For Partners')}</h3>
                                <ul className="space-y-3">
                                    {/* <li><a href="#" className="fading text-gray-300 hover:text-white transition-colors">Partner Signup</a></li> */}
                                    <li><Link href="/contact-us" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.for_partners.support', 'Support')}</Link></li>
                                    <li><a href="https://play.google.com/store/apps/details?id=com.kswiftservice&pcampaignid=web_share" target="_blank" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.for_partners.download_app', 'Download our app')}</a></li>
                                    <li><Link href="/partner-terms-conditions" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.for_partners.terms', 'Partner Terms & Conditions')}</Link></li>
                                </ul>
                            </div>

                            {/* Fifth Column - Legal */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold tracking-wide uppercase text-sm">{t('footer.legal.title', 'Legal')}</h3>
                                <ul className="space-y-3">
                                    <li><Link href="/privacy-and-policy" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.legal.privacy', 'Privacy Policy')}</Link></li>
                                    <li><Link href="/terms-and-conditions" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.legal.terms', 'Terms & Conditions')}</Link></li>
                                    <li><Link href="/business-policy" className="fading text-gray-300 hover:text-white transition-colors">{t('footer.legal.business', 'Business Policy')}</Link></li>
                                </ul>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <div>{t('footer.copyright', '© KSWIFTSERVICES 2025')}</div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0">
                        <Link href="/privacy-and-policy" className="hover:text-white transition-colors">{t('footer.bottom.privacy', 'Privacy Policy')}</Link>
                        <Link href="/terms-and-conditions" className="hover:text-white transition-colors">{t('footer.bottom.terms', 'Terms & Conditions')}</Link>
                        <Link href="/customer-terms-conditions" className="hover:text-white transition-colors">{t('footer.bottom.customer_terms', 'Customer Terms')}</Link>
                        <Link href="/partner-terms-conditions" className="hover:text-white transition-colors">{t('footer.bottom.partner_terms', 'Partner Terms')}</Link>
                        <Link href="/business-policy" className="hover:text-white transition-colors">{t('footer.bottom.business_policy', 'Business Policy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
