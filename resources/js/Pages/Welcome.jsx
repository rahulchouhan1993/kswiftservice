import React from 'react';
import Layout from './layout/Layout';
import Hero from './home/Hero';
import HowWorks from './home/HowWorks';
import WhyUs from './home/WhyUs';
import VehicleNeeds from './home/VehicleNeeds';
import HomeServices from './home/HomeServices';
import n4 from '../img/n4.png';
import n3 from '../img/n3.png';
import n2 from '../img/n2.png';
import n1 from '../img/n1.png';
import Testimonials from './home/Testimonials';
import YourCustomers from './home/YourCustomers';
import HomeFaq from './home/HomeFaq';
import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <Layout>
            <div className="">
                {/* Grid Background */}
                {/* <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      */}
                <Hero />

                <HowWorks />

                <WhyUs />

                <VehicleNeeds />

                <HomeServices />

                <div className='container mx-auto'>
                    <div className="mt-12 sm:mt-16 md:mt-20 rounded-[25px] p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
                        <div className="w-full bg-black rounded-[25px] relative z-10 mx-auto px-4 py-4 sm:py-16 md:py-20 text-center">

                            {/* Background blur effect - responsive positioning */}
                            <div className="hidden sm:block absolute top-[100px] sm:top-[120px] md:top-[150px] left-[20%] sm:left-[25%] w-[60%] sm:w-[50%] h-[120px] sm:h-[150px] md:h-[200px] mx-auto bg-main rounded-full filter blur-3xl opacity-1"></div>

                            <div className="rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative z-1">
                                <h2 className="fading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white max-w-4xl mx-auto leading-tight">
                                    Join the Network. Grow Your Business.
                                </h2>
                                <p className="fading text-gray-300 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                                    Thousands of Partners and garages trust us to bring them verified customers daily.
                                </p>

                                {/* Features list - responsive grid */}
                                <div className='mb-6 sm:mb-8'>
                                    <ul className=' text-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto'>
                                        <li className='fading text-white flex items-center justify-center sm:justify-start text-sm sm:text-base' >
                                            <img src={n1} className='w-5 h-5 sm:w-6 sm:h-6 me-2 flex-shrink-0' alt="" />
                                            <span className="break-words">Build 5 star reputation</span>
                                        </li>
                                        <li className='fading text-white flex items-center justify-center sm:justify-start text-sm sm:text-base' >
                                            <img src={n2} className='w-5 h-5 sm:w-6 sm:h-6 me-2 flex-shrink-0' alt="" />
                                            <span className="break-words">Instant customer leads</span>
                                        </li>
                                        <li className='fading text-white flex items-center justify-center sm:justify-start text-sm sm:text-base' >
                                            <img src={n3} className='w-5 h-5 sm:w-6 sm:h-6 me-2 flex-shrink-0' alt="" />
                                            <span className="break-words leading-[16px]">Dedicated garage dashboard</span>
                                        </li>
                                        <li className='fading text-white flex items-center justify-center sm:justify-start text-sm sm:text-base' >
                                            <img src={n4} className='w-5 h-5 sm:w-6 sm:h-6 me-2 flex-shrink-0' alt="" />
                                            <span className="break-words">Weekly payments</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* CTA Button - responsive */}
                                <Link href={'/contact-us'} className="fading w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 bg-white text-base sm:text-lg text-main font-semibold rounded-full transition-all duration-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                                    Partner With Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <Testimonials />

                <YourCustomers />

                <HomeFaq />
            </div>
        </Layout>
    );
}
