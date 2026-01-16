import React from 'react'
import handimage from '../../img/hand-mobile.png'
import { Link } from '@inertiajs/react'

export default function Hero() {
    return (
        <section className="bg-black  relative overflow-hidden">
            {/* Background Grid - Hidden on mobile, responsive positioning */}
            <div className=" lg:opacity-[0.6] items-center w-[80%] h-[400px] justify-center absolute top-[70px] left-[5%] p-0 z-[1]">
                <div className='gridmap w-full h-full absolute top-0 left-0 z-[2]'></div>
                <div className="absolute w-full h-full rounded-2xl overflow-hidden z-[1]
          [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
          bg-[length:50px_50px] md:bg-[length:70px_70px]">
                </div>
            </div>

            <div className="container mx-auto relative z-[3]   px-4 sm:px-6 lg:px-8">
                <div className="pt-[150px]  border-b border-gray-700 lg:flex flex-col-reverse lg:flex-row items-center gap-8 md:gap-10 lg:gap-12">
                    <div className="px-[30px] lg:px-0 w-full mx-auto lg:!mx-0 max-w-[650px] xl:max-w-[40%] text-center md:text-left pb-[40px]">
                        <div className="pt-[30px] lg:pt-[0px] hero-content mx-auto lg:mx-0 lg:mx-0">
                            <h1
                                data-aos="fade-right"
                                className="mx-auto lg:mx-[0] max-w-[500px] xl:max-w-full text-center lg:text-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white"
                            >
                                Reliable Car & Bike Service — Whenever You Need It.
                            </h1>

                            <p
                                data-aos="fade-right"
                                className=" text-center  lg:text-start text-gray-300 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed max-w-prose"
                            >
                                Skip the garage visits. Get verified Partners, real-time updates, and doorstep pickup/drop —
                                <span className='text-main font-bold'>all from one powerful app.</span>
                            </p>

                            <div data-aos="fade-right" className="flex flex-col sm:flex-row gap-3 sm:gap-4  justify-center lg:justify-start">
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.kswiftservice&pcampaignid=web_share"
                                    target="_blank"
                                >
                                    <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-main text-white font-medium transition-all duration-300 hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                                        Download the App
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="w-full  xl:max-w-[60%] flex justify-center md:justify-end">
                        <div className="relative w-full">
                            <img
                                data-aos="fade-up"
                                src={handimage}
                                alt="KSwift App Mockup"
                                className="w-full h-auto object-contain rounded-xl shadow-2xl shadow-black/30"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
