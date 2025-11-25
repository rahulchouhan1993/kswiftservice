import React, { useEffect, useRef, useState } from 'react'
import hand2 from '../../img/hand2.png'
import { IoMdCloudDownload } from "react-icons/io";

export default function HowWorks() {
   const [activeTab, setActiveTab] = React.useState('customers');
   const [openIndex, setOpenIndex] = useState(0) // first open by default

   const customers = [ 
      {
         title: 'Set Up Your Profile and Vehicle',
         description: 'Install the app, select whether you’re a customer or Partner, and register your car or bike with its basic details so the system can tailor services accurately.'
      },
      {
         title: 'Choose the Service and Mode of Delivery',
         description: 'Pick the required service (repair, maintenance) and choose delivery mode — pickup, at-home, or at a partner workshop.'
      },
      {
         title: 'Automatic Partner Allocation With Live Tracking',
         description: 'Our system assigns the best nearby partner automatically and provides live tracking so you know ETA and progress.'
      },
      {
         title: 'Approve & Monitor Work and Pay Securely',
         description: 'Review the work, confirm completion, and pay through secure integrated payment options with digital receipts.'
      },
   ]

   const partners = [
      {
         title: 'Create Your Partner Profile',
         description: 'Sign up as a Partner, complete your profile with necessary details, and get verified to start receiving service requests.'
      },
      {
         title: 'Receive Service Requests',
         description: 'Get notified of service requests from customers in your area through the app, allowing you to choose jobs that fit your schedule.'
      },
      {
         title: 'Provide Quality Service',
         description: 'Use the app to manage appointments, track service progress, and communicate with customers for a seamless experience.'
      },
      {
         title: 'Get Paid Securely',
         description: 'Complete the service, get customer approval, and receive payments directly through the app with our secure payment system.'
      },
   ]  

   // Reset open index whenever tab changes to keep first item opened by default
   useEffect(() => {
      setOpenIndex(0)
   }, [activeTab])

  return (
    <>
       <section className="relative z-10 max-w-7xl mx-auto px-6 ">
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl lg:text-4xl font-bold mb-2">How it <span className='text-main'>Works</span></h2>
          <p className='text-gray-500 mb-8'>Discover how our platform empowers car and bike repair services to thrive in the digital world.</p>
        </div>

        <div className=' w-fit mx-auto rounded-full '>
        <div className='tabs p-2 bg-black rounded-full gap-3 flex justify-center'>
          <button onClick={() => setActiveTab('customers')} className={`btn text-white uppercase   !border-1 ${activeTab === 'customers' ? 'bg-main border-[var(--main)]' : '!border-gray-500 !bg-black'} `}>Customers</button>
          <button onClick={() => setActiveTab('partners')} className={`btn text-white uppercase  !border-1 ${activeTab === 'partners' ? 'bg-main border-[var(--main)]' : '!border-gray-500 !bg-black'} `}>Partners</button>
        </div>
        </div>
        
         <div className='flex flex-col lg:flex-row items-center gap-10 mt-8'>
            <div data-aos="zoom-out-right" className='  relative max-w-[520px] w-full handbox rounded-[30px] bg-dark flex-shrink-0'>
               <img src={hand2} alt="how it works visual" className=' rounded-[30px] w-full h-auto object-cover' />
               <button className='absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full  bg-main text-white font-medium   transition-all duration-300 shadow-inset shadow-lg flex items-center justify-center  '> <IoMdCloudDownload className="me-2" size='20' /> Download</button>
            </div>
            <div className='max-w-[640px] w-full  accordians'>

               { activeTab === 'customers' && (
                  <AccordionList items={customers} openIndex={openIndex} setOpenIndex={setOpenIndex} />
               )}

               { activeTab === 'partners' && (
                  <AccordionList items={partners} openIndex={openIndex} setOpenIndex={setOpenIndex} />
               )}
            </div>
         </div>
      </section>
    </>
  )
}

function AccordionList({ items = [], openIndex, setOpenIndex }) {
   if (!items || !items.length) return null

   return (
      <div>
         {items.map((item, idx) => (
            <AccordionItem
               key={idx}
               idx={idx}
               title={item.title}
               description={item.description}
               isOpen={openIndex === idx}
               onToggle={() => setOpenIndex(prev => (prev === idx ? -1 : idx))}
            />
         ))}
      </div>
   )
}

function AccordionItem({ idx, title, description, isOpen, onToggle }){
   const contentRef = useRef(null)
   const [maxH, setMaxH] = useState('0px')

   useEffect(() => {
      if (isOpen && contentRef.current) {
         // set to scrollHeight to enable smooth open transition
         setMaxH(`${contentRef.current.scrollHeight}px`)
      } else {
         setMaxH('0px')
      }
   }, [isOpen])

   return (
      <div className='fading relative p-[1px] mb-4 rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800'>
         <div className='bg-black p-[22px] relative overflow-hidden rounded-[19px]'>
            <div className='flex items-start gap-4 w-full'>
               <div className="flex-shrink-0">
                  <span className="text-transparent text-[20px] font-bold bg-clip-text bg-black border-text">{`0${idx + 1}`}</span>
               </div>

               <div className='flex-1'>
                  <button
                     onClick={onToggle}
                     aria-expanded={isOpen}
                     aria-controls={`panel-${idx}`}
                     className='w-full text-left'
                  >
                     <h3 className='relative z-10 text-gray-200 font-bold text-[20px]'>{title}</h3>
                     {/* <p className='text-gray-400 mt-1 text-[14px] line-clamp-1'>{description}</p> */}
                  </button>
               </div>

               <div className='flex-shrink-0 self-center'>
                  <svg
                     className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                     viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     aria-hidden="true"
                  >
                     <path d="M5 8.5L10 13.5L15 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </div>
            </div>

            <div
               id={`panel-${idx}`}
               ref={contentRef}
               style={{ maxHeight: maxH }}
               className='overflow-hidden transition-[max-height] duration-300 ease-in-out mt-4'
               aria-hidden={!isOpen}
            >
               <div className='pt-2 pb-4'>
                  <p className='text-gray-300 text-sm'>{description}</p>
               </div>
            </div>
         </div>

         <div className='turbo-gradient w-full max-w-[200px] absolute bottom-0 left-0' />
      </div>
   )
}
