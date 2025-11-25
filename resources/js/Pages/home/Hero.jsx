import React from 'react'
import handimage from '../../img/hand-mobile.png'

export default function Hero() {
  return (
         <section className="bg-black py-20">

            <div className=" flex items-center w-[90%] h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1px]">
               <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
               <div class="absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
               [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
               bg-[length:70px_70px]" ></div>
            </div>

            <div className="container relative z-[3] border-b border-gray-700 mx-auto flex flex-col lg:flex-row items-center gap-12">
               <div className="max-w-[30%]">
                  <div className="min-w-[650px] ps-[20px]">
                     {/* <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gray-800 border border-cyan-500/30">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                           <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm text-cyan-400">How it Works</span>
                     </div> */}
                     
                     <h1 data-aos="fade-right" className="text-4xl lg:text-[65px] font-bold mb-6 leading-[0.9] heading-lg">
                     Reliable Car & Bike Service — Whenever You Need It.
                     </h1>
                     
                     <p data-aos="fade-right" className="text-gray-300 text-lg mb-8 leading-relaxed">
                     Skip the garage visits. Get verified Partners, real-time updates, and doorstep pickup/drop — <span className='text-main font-bold'>all from one powerful app.</span>
                     </p>
                     
                     <button data-aos="fade-right" className="rounded-full !p-[1px] bg-gradient-to-r from-gray-400 to-gray-900/40"> 
                        <span className='btn text-white border-gray-700 block'>Download the App</span>
                     </button>
                  </div>
               </div>
               <div className="max-w-[66%] flex justify-center">
                  <div className="relative relative right-[-100px] ">
                     <img data-aos="fade-up" src={handimage} alt="KSwift App Mockup" className="w-80 md:w-96 lg:w-full rounded-xl shadow-2xl shadow-black/30" />
                  </div>
               </div>
            </div>
      </section>
  )
}
