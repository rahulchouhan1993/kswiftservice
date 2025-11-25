import React from 'react'
import member from '../../img/team.png'
import member3 from '../../img/team3.png'
import member4 from '../../img/team4.png'
import member2 from '../../img/team2.png'


export default function Teams() {
  return (
    <div className=' mx-auto'>
      <div className='py-20'>
          <div className="text-center mb-8">
              <h2 className="fading text-white text-3xl lg:text-4xl font-bold mb-2">The Team Behind the Platform</h2>
              <p className='fading text-gray-500 mb-8 max-w-[800px] mx-auto'>A cross-functional team of engineers, designers, and automotive professionals focused on building a predictable, technology-driven service ecosystem.</p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>

              <div className='text-center mb-3 w-full sm:max-w-[400px] lg:max-w-[auto] '>
                  <img src={member} className='w-full mx-auto mb-4 rounded-[20px]' />
                  <h3 className='text-white font-bold  fading  capitalize'>John Doe</h3>
                  <p className='text-main uppercase fading text-bold text-sm'>CEO & Founder</p>
              </div>
              <div className='text-center mb-3 w-full sm:max-w-[400px] lg:max-w-[auto] '>
                  <img src={member2} className='w-full mx-auto mb-4 rounded-[20px]' />
                  <h3 className='text-white font-bold  fading  capitalize'>John Doe</h3>
                  <p className='text-main uppercase fading text-bold text-sm'>CEO & Founder</p>
              </div>
              <div className='text-center mb-3 w-full sm:max-w-[400px] lg:max-w-[auto] '>
                  <img src={member3} className='w-full mx-auto mb-4 rounded-[20px]' />
                  <h3 className='text-white font-bold fading   capitalize'>John Doe</h3>
                  <p className='text-main uppercase fading text-bold text-sm'>CEO & Founder</p>
              </div>
              <div className='text-center mb-3 w-full sm:max-w-[400px] lg:max-w-[auto] '>
                  <img src={member4 } className='w-full mx-auto mb-4 rounded-[20px]' />
                  <h3 className='text-white font-bold fading   capitalize'>John Doe</h3>
                  <p className='text-main uppercase fading text-bold text-sm'>CEO & Founder</p>
              </div>
              
            </div>
        
      </div>
    </div>
  )
}
