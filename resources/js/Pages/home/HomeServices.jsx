import React from 'react';
import service1 from '../../img/service1.png';
import service2 from '../../img/service2.png';
export default function HomeServices() {
  return (
    <>
      <div className='container mx-auto'>
          <div className="rounded-[25px] !p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
          <div className="bg-black rounded-[25px] pt-8 flex  items-center">
              <div className='relative serivice-left w-full max-w-[45%] flex justify-center'>
                  <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] mx-auto bg-blue-500 rounded-full 
                  filter blur-3xl opacity-1  "></div>
                  <img className='z-[1]' src={service1}  />
              </div>
              <div className='p-12  serivice-right w-full max-w-[55%]'>
                  <h2 className='text-main font-bold uppercase text-lg'>FOR CUSTOMERS</h2>
                  <h3 className='text-white font-bold text-[40px] leading-[39px] mt-2'>Designed for Drivers Who Value Transparency & Convenience</h3>
                  <ul className='text-gray-400 list-disc ps-4 mt-4'>
                    <li className='mt-2 text-[18px]'>Book any service in seconds</li>
                    <li className='mt-2 text-[18px]'>Get doorstep pickup & drop</li>
                    <li className='mt-2 text-[18px]'>Track your vehicle’s service live</li>
                    <li className='mt-2 text-[18px]'>View prices upfront</li>
                    <li className='mt-2 text-[18px]'>Download your service history and invoices anytime</li>
                    <li className='mt-2 text-[18px]'>Pay securely after you’re satisfied</li>
                  </ul>
                  <button className="mt-6 rounded-full !p-[1px] bg-gradient-to-r from-gray-600 to-gray-900/5"> 
                        <span className='btn text-gray-300 border-gray-700 block text-[18px]'>Book Service</span>
                  </button>
              </div>
          </div>
          </div>


          <div className="mt-[60px] rounded-[25px] !p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
          <div className="bg-black rounded-[25px] pt-8 flex  items-center">
              <div className='p-12 serivice-right w-full max-w-[55%]'>
                  <h2 className='text-main font-bold uppercase text-lg'>FOR PARTNERS </h2>
                  <h3 className='text-white font-bold text-[40px] leading-[39px] mt-2'>Grow Your Earnings with a Platform Built for You</h3>
                  <ul className='text-gray-400 list-disc ps-4 mt-4'>
                    <li className='mt-2 text-[18px]'>Receive daily leads from customers near you</li>
                    <li className='mt-2 text-[18px]'>Get car & bike jobs that match your skills</li>
                    <li className='mt-2 text-[18px]'>Manage bookings, timings & payments easily</li>
                    <li className='mt-2 text-[18px]'>Track your income instantly</li>
                    <li className='mt-2 text-[18px]'>Build a 5-star reputation</li>
                    <li className='mt-2 text-[18px]'>Zero joining fee — join and start earning</li>
                  </ul>
                  <button className="mt-6 rounded-full !p-[1px] bg-gradient-to-r from-gray-600 to-gray-900/5"> 
                        <span className='btn text-gray-300 border-gray-700 block text-[18px]'>Book Service</span>
                  </button>
              </div>
              <div className='relative serivice-left w-full max-w-[45%] flex justify-center'>
                  <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] mx-auto bg-blue-500 rounded-full 
                  filter blur-3xl opacity-1  "></div>
                  <img className='z-[1]' src={service2}  />
              </div>
          </div>
          </div>
      </div>
    </>
  )
}
