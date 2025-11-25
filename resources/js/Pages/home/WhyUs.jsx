import React from 'react'
import icon1 from '../../img/why1.png'
import icon3 from '../../img/why3.png'
import icon2 from '../../img/why2.png'

export default function WhyUs() {
  return (
    <>
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className=" flex items-center w-[700px] h-[400px] justify-center absolute top-[0px] left-[-5%] p-6 z-[-1px]">
            <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
            <div class="absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
            [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
            bg-[length:70px_70px]" ></div>
        </div>

        <div className='z-10 relative'>
          <div className="text-center mb-8">
            <h2 className="text-white text-3xl lg:text-4xl font-bold mb-2">Why Choose Us?</h2>
            <p className='text-gray-500 mb-8'>Discover how partnering with us can elevate your car and bike repair experience, helping you thrive in the digital world.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-[20px] !p-[1px] bg-gradient-to-r from-gray-500 to-gray-700">
              <div className="bg-dark rounded-[20px] p-6 text-start">
                <div className="w-14 h-14  mb-4">
                <img src={icon1} />
                </div>
                <h3 className="text-xl text-gray-300 mb-1">Verified Partners </h3>
                <p className="text-gray-400 text-sm">Every Partner passes verified skill checks.</p>
              </div>
            </div>

            <div className="rounded-[20px] !p-[1px] bg-gradient-to-r from-gray-500 to-gray-700">
              <div className="bg-dark rounded-[20px] p-6 text-start">
                <div className="w-14 h-14  mb-4">
                <img src={icon2} />
                </div>
                <h3 className="text-xl text-gray-300 mb-1">Transparent Pricing</h3>
                <p className="text-gray-400 text-sm">Instant estimates and digital invoices.</p>
              </div>
            </div>

            <div className="rounded-[20px] !p-[1px] bg-gradient-to-r from-gray-500 to-gray-700">
              <div className="bg-dark rounded-[20px] p-6 text-start">
                <div className="w-14 h-14  mb-4">
                <img src={icon3} />
                </div>
                <h3 className="text-xl text-gray-300 mb-1">Live Tracking </h3>
                <p className="text-gray-400 text-sm">Know exactly what’s happening with your car.</p>
              </div>
            </div>
            
            
            
            
          </div>
        </div>
      </section>

    </>
  )
}
