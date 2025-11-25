import React from 'react'
import f9 from '../../img/f9.png'
import f8 from '../../img/f8.png'
import f7 from '../../img/f7.png'
import f6 from '../../img/f6.png'
import f5 from '../../img/f5.png'
import f4 from '../../img/f4.png'
import f3 from '../../img/f3.png'
import f2 from '../../img/f2.png'
import f1 from '../../img/f1.png'

export default function VehicleNeeds() {

   const features = [
      {
         title: 'Car and Bike Periodic Service',
         description: 'Routine servicing with oil change, filter replacement, and essential system checks.',
         icon: f1
      },
      {
         title: 'Engine Repair and Diagnostics',
         description: 'Accurate fault detection and repair for noise, power loss, and performance issues.',
         icon: f2
      },
      {
         title: 'Car AC Repair',
         description: 'Compressor service, gas refill, and leak checks to restore steady cooling.',
         icon: f3
      },
      {
         title: 'Tyres, Wheels and Alignment',
         description: 'Alignment, balancing, and tyre services for stable handling and even wear.',
         icon: f4
      },
      {
         title: 'Brakes, Clutch and Gearbox',
         description: 'Repair and replacement for responsive braking, smooth shifts, and steady control.',
         icon: f5
      },
      {
         title: 'Battery Replacement',
         description: 'Quick, genuine battery replacement with reliable performance.',
         icon: f6
      },
      {
         title: 'Bike Care Essentials',
         description: 'Chain, sprocket, tuning, and oil services for consistent bike performance.',
         icon: f7
      },
      {
         title: 'Denting and Painting',
         description: 'Panel correction and repainting for a clean, uniform finish.',
         icon: f8
      },
      {
         title: 'Emergency On-Road Support',
         description: 'Towing, jump-starts, tyre change, and recovery support during breakdowns.',
         icon: f9
      },
   ];

  return (
     <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
         <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-white text-3xl lg:text-4xl font-bold mb-2">Everything Your Vehicle Needs</h2>
            <p className='text-gray-500 mb-8'>From routine maintenance to urgent repairs, get the right service delivered by verified experts</p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
         {features && features.map((feature, index) => {
            return <>
               <div className="fading rounded-[20px] !p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
                  <div className="bg-black h-full rounded-[20px] p-6 text-start">
                     <div className="w-14 h-14 ">
                        <img src={feature.icon} />
                     </div>
                     <h3 className="text-xl text-gray-300 mb-1">{feature.title}</h3>
                     <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
               </div>
            </>
         })}
        </div>
    </section>
  )
}
