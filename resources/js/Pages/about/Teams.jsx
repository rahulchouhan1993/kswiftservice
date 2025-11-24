import React from 'react'
import member from '../../img/team.png'
import member3 from '../../img/team3.png'
import member4 from '../../img/team4.png'
import member2 from '../../img/team2.png'


export default function Teams() {
  return (
    <div className='py-20'>
         <div className="text-center mb-8">
            <h2 className="text-white text-3xl lg:text-4xl font-bold mb-2">The Team Behind the Platform</h2>
            <p className='text-gray-500 mb-8 max-w-[800px] mx-auto'>A cross-functional team of engineers, designers, and automotive professionals focused on building a predictable, technology-driven service ecosystem.</p>
          </div>

          <div className='grid grid-cols-4 gap-4'>

            <div className='text-center'>
                <img src={member} className='mx-auto mb-4 rounded-[20px]' />
                <h3 className='text-white font-bold   capitalize'>John Doe</h3>
                <p className='text-main uppercase text-bold text-sm'>CEO & Founder</p>
            </div>
            <div className='text-center'>
                <img src={member2} className='mx-auto mb-4 rounded-[20px]' />
                <h3 className='text-white font-bold   capitalize'>John Doe</h3>
                <p className='text-main uppercase text-bold text-sm'>CEO & Founder</p>
            </div>
            <div className='text-center'>
                <img src={member3} className='mx-auto mb-4 rounded-[20px]' />
                <h3 className='text-white font-bold   capitalize'>John Doe</h3>
                <p className='text-main uppercase text-bold text-sm'>CEO & Founder</p>
            </div>
            <div className='text-center'>
                <img src={member4} className='mx-auto mb-4 rounded-[20px]' />
                <h3 className='text-white font-bold   capitalize'>John Doe</h3>
                <p className='text-main uppercase text-bold text-sm'>CEO & Founder</p>
            </div>
            
          </div>
      
    </div>
  )
}
