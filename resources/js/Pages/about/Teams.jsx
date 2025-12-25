import React from 'react'
import menIcon from '../../img/men_icon.png'
import womenIcon from '../../img/women_icon.png'


export default function Teams() {
    return (
        <div className=' mx-auto'>
            <div className='py-20'>
                <div className="text-center mb-8">
                    <h2 className="fading text-white text-3xl lg:text-4xl font-bold mb-2">The Team Behind the Platform</h2>
                    <p className='fading text-gray-500 mb-8 max-w-[800px] mx-auto'>A cross-functional team of engineers, designers, and automotive professionals focused on building a predictable, technology-driven service ecosystem.</p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>

                    <div className='text-center mb-3 w-full sm:max-w-[400px] lg:max-w-[auto] '>
                        <img src={menIcon} className='w-full mx-auto mb-4 rounded-[20px]' />
                        <h3 className='text-white font-bold  fading  capitalize'>Mr. Varda Raju B. V</h3>
                        <p className='text-main uppercase fading text-bold text-sm'>CEO & Founder</p>
                    </div>
                    <div className='text-center mb-3 w-full sm:max-w-[400px] lg:max-w-[auto] '>
                        <img src={womenIcon} className='w-full mx-auto mb-4 rounded-[20px]' />
                        <h3 className='text-white font-bold  fading  capitalize'>Smt. K. Vidya Gupta</h3>
                        <p className='text-main uppercase fading text-bold text-sm'>CEO & Founder</p>
                    </div>
                    <div className='text-center mb-3 w-full sm:max-w-[400px] lg:max-w-[auto] '>
                        <img src={menIcon} className='w-full mx-auto mb-4 rounded-[20px]' />
                        <h3 className='text-white font-bold fading   capitalize'>Muthu M</h3>
                        <p className='text-main uppercase fading text-bold text-sm'>CEO & Founder</p>
                    </div>

                </div>

            </div>
        </div>
    )
}
