import React from 'react'
import handimage from '../../img/hand-mobile.png'

export default function Hero() {
  return (
    <section className="bg-black py-10 sm:py-14 md:py-20 relative overflow-hidden">
      {/* Background Grid - Hidden on mobile, responsive positioning */}
      <div className="hidden md:flex items-center w-[90%] h-[400px] md:h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1]">
        <div className='gridmap w-full h-full absolute top-0 left-0 z-[2]'></div>
        <div className="absolute w-full h-full rounded-2xl overflow-hidden z-[1]
          [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
          bg-[length:50px_50px] md:bg-[length:70px_70px]">
        </div>
      </div>

      <div className="container mx-auto relative z-[3] border-b border-gray-700 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10 lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="max-w-2xl mx-auto md:mx-0">
              <h1 
                data-aos="fade-right" 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white"
              >
                Reliable Car & Bike Service — Whenever You Need It.
              </h1>
              
              <p 
                data-aos="fade-right" 
                className="text-gray-300 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed max-w-prose"
              >
                Skip the garage visits. Get verified Partners, real-time updates, and doorstep pickup/drop — 
                <span className='text-main font-bold'>all from one powerful app.</span>
              </p>
              
              <div data-aos="fade-right" className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center md:justify-start">
                <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-main text-white font-medium transition-all duration-300 hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                  Download the App
                </button>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
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
