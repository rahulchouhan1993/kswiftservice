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
import { useTranslation } from 'react-i18next';

export default function VehicleNeeds() {
   const { t } = useTranslation();

   const features = [
      {
         title: t('vehicle_needs.item1_title', 'Car and Bike Periodic Service'),
         description: t('vehicle_needs.item1_desc', 'Routine servicing with oil change, filter replacement, and essential system checks.'),
         icon: f1
      },
      {
         title: t('vehicle_needs.item2_title', 'Engine Repair and Diagnostics'),
         description: t('vehicle_needs.item2_desc', 'Accurate fault detection and repair for noise, power loss, and performance issues.'),
         icon: f2
      },
      {
         title: t('vehicle_needs.item3_title', 'Car AC Repair'),
         description: t('vehicle_needs.item3_desc', 'Compressor service, gas refill, and leak checks to restore steady cooling.'),
         icon: f3
      },
      {
         title: t('vehicle_needs.item4_title', 'Tyres, Wheels and Alignment'),
         description: t('vehicle_needs.item4_desc', 'Alignment, balancing, and tyre services for stable handling and even wear.'),
         icon: f4
      },
      {
         title: t('vehicle_needs.item5_title', 'Brakes, Clutch and Gearbox'),
         description: t('vehicle_needs.item5_desc', 'Repair and replacement for responsive braking, smooth shifts, and steady control.'),
         icon: f5
      },
      {
         title: t('vehicle_needs.item6_title', 'Battery Replacement'),
         description: t('vehicle_needs.item6_desc', 'Quick, genuine battery replacement with reliable performance.'),
         icon: f6
      },
      {
         title: t('vehicle_needs.item7_title', 'Bike Care Essentials'),
         description: t('vehicle_needs.item7_desc', 'Chain, sprocket, tuning, and oil services for consistent bike performance.'),
         icon: f7
      },
      {
         title: t('vehicle_needs.item8_title', 'Denting and Painting'),
         description: t('vehicle_needs.item8_desc', 'Panel correction and repainting for a clean, uniform finish.'),
         icon: f8
      },
      {
         title: t('vehicle_needs.item9_title', 'Emergency On-Road Support'),
         description: t('vehicle_needs.item9_desc', 'Towing, jump-starts, tyre change, and recovery support during breakdowns.'),
         icon: f9
      },
   ];

  return (
   <div id='services' className='container mx-auto'>
     <section className="relative z-10 py-20">
         <div data-aos="fade-up" className="text-center mb-8 px-4">
            <h2 className="text-white text-3xl lg:text-4xl font-bold mb-2">{t('vehicle_needs.title', 'Everything Your Vehicle Needs')}</h2>
            <p className='text-gray-500 mb-8'>{t('vehicle_needs.description', 'From routine maintenance to urgent repairs, get the right service delivered by verified experts')}</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
         {features && features.map((feature, index) => {
            return (
               <div key={index} className="fading rounded-[20px] !p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
                  <div className="bg-black h-full rounded-[20px] p-6 text-start">
                     <div className="w-14 h-14 ">
                        <img src={feature.icon} alt={feature.title} />
                     </div>
                     <h3 className="text-xl text-gray-300 mb-1">{feature.title}</h3>
                     <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
               </div>
            )
         })}
        </div>
    </section>
   </div>
  )
}
