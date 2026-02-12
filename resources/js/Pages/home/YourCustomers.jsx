import React from 'react'
import { useTranslation } from 'react-i18next';

export default function YourCustomers() {
    const { t } = useTranslation();

    return (
        <div className='container mx-auto'>
            <div className='py-20 bg-black relative'>

                <div className=" flex items-center w-[700px] h-[400px] justify-center absolute top-[0px] left-[25%] p-6 z-[-1px]">
                    <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
                    <div class="absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
               [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
               bg-[length:70px_70px] opacity-80" ></div>
                </div>

                <div className='relative z-[30]'>
                    <h2 className='text-white text-center text-[50px] font-bold leading-[40px] fading'>{t('your_customers.title_part1', 'Your Car. Your Customers.')} <br></br> <span className='text-main'>{t('your_customers.title_part2', 'One App.')}</span></h2>
                    <p className='text-white text-center mt-2 fading'>{t('your_customers.description_part1', 'Download the')} <a href='#' className='text-main2'>kswiftservices</a> {t('your_customers.description_part2', 'and experience the easiest way to connect drivers and Partners .')}</p>
                    <div className='flex justify-center mt-8'>
                        <a href="https://play.google.com/store/apps/details?id=com.kswiftservice&pcampaignid=web_share" target="_blank">
                            <button className="rounded-full !p-[1px] bg-gradient-to-r fading from-gray-400 to-gray-900/40">
                                <span className='btn text-white border-gray-700 block '>{t('your_customers.btn', 'Download our app today!')}</span>
                            </button>
                        </a>
                    </div>
                </div>



            </div>
        </div>
    )
}
