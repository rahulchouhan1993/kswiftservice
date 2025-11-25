import React from 'react'
import a6 from '../../img/a6.png'
import a5 from '../../img/a5.png'
import a4 from '../../img/a4.png'
import a3 from '../../img/a3.png'
import a2 from '../../img/a2.png'
import a1 from '../../img/a1.png'


export default function AboutFeatures() {

   const features = [
      {
         title: 'Instant job allocation based on skill and location',
         icon: a1
      },
      {
         title: 'Live progress updates with status checkpoints',
         icon: a2
      },
      {
         title: 'Direct chat to remove miscommunication',
         icon: a3
      },
      {
         title: 'Digitized invoices and service records',
         icon: a4
      },
      {
         title: 'Weekly payouts to partner garages',
         icon: a5
      },
      {
         title: 'A Workflows for pickup, drop-off, and inspection',
         icon: a6
      }
   ];

  return (
     <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
         <div className="text-center mb-8 "  >
            <h2 className="fading text-white text-3xl lg:text-4xl font-bold mb-2">Our Approach</h2>
            <p className='fading text-gray-500 mb-8'>A System, Not Just an App. Every feature exists to reduce friction:</p>
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
