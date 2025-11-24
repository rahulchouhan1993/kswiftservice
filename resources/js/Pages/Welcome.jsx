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

export default function Welcome() {
  return (
    <Layout>
    <div className="">
      {/* Grid Background */}
      
      
        {/* <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      */}
      <Hero/>

      <HowWorks />

      <WhyUs />

       <VehicleNeeds />

      <HomeServices />

      <div className='container mx-auto'>
          <div className="mt-[60px] rounded-[25px] !p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
            <div className="bg-black rounded-[25px] relative z-10 max-w-7xl mx-auto px-6 py-20 text-center overflow-hidden">
              
                <div className="absolute top-[150px] left-[25%] w-[50%] h-[200px] mx-auto bg-main rounded-full 
                filter blur-3xl opacity-1  "></div>
                        
                <div className="rounded-2xl p-12 relative z-1">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                    Join the Network. Grow Your Business.
                  </h2>
                  <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                    Thousands of Partners  and garages trust to bring them verified customers daily.
                  </p>

                  <div className='live-bar bg-black p-2 mb-8'>
                    <ul className='flex justify-center gap-6'>
                      <li className='text-white flex items-center uppercase ' ><img src={n1}  className='w-[20px] h-[20px] me-2'  /> Build 5 star reputation</li>
                      <li className='text-white flex items-center uppercase ' > <img src={n2} className='w-[20px] h-[20px] me-2'   /> Instant customer leads</li>
                      <li className='text-white flex items-center uppercase ' ><img src={n3}  className='w-[20px] h-[20px] me-2'  /> Dedicated garage dashboard</li>
                      <li className='text-white flex items-center uppercase ' ><img src={n4}  className='w-[20px] h-[20px] me-2'  /> Weekly payments</li>
                    </ul>
                  </div>


                  <button className="btn bg-white text-lg text-main px-[40px]">
                    Partner With Us
                  </button>
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