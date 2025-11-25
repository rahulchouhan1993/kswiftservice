import React from 'react'
import icon1 from '../../img/why1.png'
import icon3 from '../../img/why3.png'
import icon2 from '../../img/why2.png'

export default function WhyUs() {
  return (
    <>
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Background Grid - Responsive and hidden on mobile */}
        <div className="hidden md:flex items-center max-w-2xl h-80 md:h-96 justify-center absolute top-0 left-0 right-0 mx-auto p-6 z-[-1] pointer-events-none">
            <div className='gridmap w-full h-full absolute top-0 left-0 z-[2]'></div>
            <div className="absolute w-full h-full rounded-2xl overflow-hidden z-[1]
            [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
            bg-[length:50px_50px] md:bg-[length:70px_70px]" ></div>
        </div>

        <div className='z-10 relative'>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 fading leading-tight">
              Why Choose Us?
            </h2>
            <p className='text-gray-500 text-base sm:text-lg mb-8 sm:mb-12 fading max-w-3xl mx-auto leading-relaxed'>
              Discover how partnering with us can elevate your car and bike repair experience, helping you thrive in the digital world.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="fading rounded-xl sm:rounded-2xl p-[1px] bg-gradient-to-r from-gray-500 to-gray-700">
              <div className="bg-dark rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 h-full text-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6">
                  <img 
                    src={icon1} 
                    className="w-full h-full object-contain" 
                    alt="Verified Partners icon"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 leading-tight">
                  Verified Partners
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Every Partner passes verified skill checks.
                </p>
              </div>
            </div>

            <div className="fading rounded-xl sm:rounded-2xl p-[1px] bg-gradient-to-r from-gray-500 to-gray-700">
              <div className="bg-dark rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 h-full text-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6">
                  <img 
                    src={icon2} 
                    className="w-full h-full object-contain" 
                    alt="Transparent Pricing icon"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 leading-tight">
                  Transparent Pricing
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Instant estimates and digital invoices.
                </p>
              </div>
            </div>

            <div className="fading rounded-xl sm:rounded-2xl p-[1px] bg-gradient-to-r from-gray-500 to-gray-700 sm:col-span-2 lg:col-span-1">
              <div className="bg-dark rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 h-full text-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6">
                  <img 
                    src={icon3} 
                    className="w-full h-full object-contain" 
                    alt="Live Tracking icon"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 leading-tight">
                  Live Tracking
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Know exactly what's happening with your car.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
