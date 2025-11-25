import { Head, Link } from '@inertiajs/react';
import Layout from './layout/Layout';
import aboutimg from '../img/aboutimg.png';
import mission from '../img/mission.png';
import vision from '../img/vision.png';
import AboutFeatures from './about/AboutFeatures'; 
import Teams from './about/Teams';
import WhyUs from './home/WhyUs';
import YourCustomers from './home/YourCustomers';

export default function AboutUs() {

    return (
        <>
        <Layout>
            <Head title="About" />
            <div className='container mx-auto px-4 sm:px-6'> 
                    <div className="hidden md:flex items-center w-[90%] h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1px]">
                        <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
                        <div class="absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
                        [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
                        bg-[length:70px_70px]" ></div>
                    </div>
                    <div className='relative z-[10] pt-[120px] sm:pt-[200px]'>
                        <h1 data-aos="fade-up" className='text-bold text-white mx-auto text-[32px] sm:text-[50px] text-center max-w-[700px] leading-[38px] sm:leading-[43px]'>Built to Fix How India Maintains Its Vehicles</h1>
                        <p data-aos="fade-up" className='max-w-[1000px] mx-auto text-gray-300 text-center mt-2 text-sm sm:text-base'>This platform was created after recognizing a common problem: people don’t trust how their vehicles are serviced, and Partners  don’t have the tools or structure to deliver consistent service. Both sides operate manually, leading to confusion, delays, and disputes.</p>
                        <p data-aos="fade-up" className='max-w-[1000px] mx-auto text-gray-300 text-center mt-2 text-sm sm:text-base'>We designed a system that brings clarity and structure to a broken process.</p>
                        <div className='rounded-[30px] mt-[30px] sm:mt-[50px] overflow-hidden max-w-[95%] sm:max-w-[90%] mx-auto'>
                            <img src={aboutimg} className='w-full h-full object-cover' />
                        </div>
                    </div>

                    <div className='grid md:grid-cols-2 mt-[60px] gap-6'>
                        <div className='fading relative p-[1px] mb-4 rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800'>
                            <div className="rounded-2xl bg-dark rounded-[19px] overflow-hidden p-6 h-full">
                                <img src={mission} className='h-[50px] w-[50px]' />
                                <h2 className='text-white text-2xl font-bold mb-1'>Our Mission</h2>
                                <p className='text-gray-400'>To revolutionize vehicle maintenance by connecting drivers with trusted Partners through a seamless digital platform, ensuring transparency, convenience, and quality service for all.</p>
                            </div>
                        </div>
                        <div className='fading relative p-[1px] mb-4 rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800'>
                            <div className="rounded-2xl bg-dark rounded-[19px] overflow-hidden p-6 h-full">
                                <img src={vision} className='h-[50px] w-[50px]' />
                                <h2 className='text-white text-2xl font-bold mb-1'>Our Vision</h2>
                                <p className='text-gray-400'>To build a unified, technology-first ecosystem that becomes the standard for vehicle care. We aim to give customers consistent, accountable service and empower Partners  with a stable, efficient workflow. Our vision is a future where quality, transparency, and reliability define every vehicle service.</p>
                            </div>
                        </div>
                    </div>

                    <AboutFeatures />

                     <div className='container mx-auto'>
                        <div className="mt-[60px] rounded-[25px] !p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
                            <div className="bg-black rounded-[25px] relative z-10 w-full mx-auto px-6 py-10 !pb-2 text-center ">
                            
                                <div className="absolute top-[150px] left-[25%] w-[50%] h-[200px] mx-auto bg-main rounded-full 
                                filter blur-3xl opacity-1  "></div>
                                        
                                <div className="rounded-2xl p-12 relative z-1">
                                <h2 className=" fading text-3xl lg:text-4xl font-bold mb-4 text-white">
                                    Numbers That Matter
                                </h2>
                                <p className=" fading text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                    Join the thousands of Partners  and garages who rely on <span className='text-main2 text-bold'>kswiftservices</span> for a steady stream of verified customers every day.
                                </p>
                                <div className='live-bar bg-black px-3 py-6 sm:py-8 mb-2'>
                                    <ul className='flex flex-col sm:flex-row justify-center gap-4 sm:gap-6'>
                                    <li className='fading text-white uppercase sm:border-r border-gray-600 px-6 sm:px-[40px] ' >
                                        <h2 className='font-bold text-3xl mb-2'>50,000+</h2>
                                         <p>Build 5 star reputation</p>
                                    </li>
                                    <li className='fading text-white uppercase sm:border-r border-gray-600 px-6 sm:px-[40px] ' >  
                                        <h2 className='font-bold text-3xl mb-2'>2,000+</h2>
                                        <p>verified Partners </p>
                                    </li>
                                    <li className='fading text-white uppercase sm:border-r border-gray-600 px-6 sm:px-[40px] ' >  
                                        <h2 className='font-bold text-3xl mb-2'>4.8★</h2>
                                        <p> Average service rating</p>
                                    </li>
                                    <li className='text-white uppercase px-6 sm:px-[40px]' >  
                                        <h2 className='font-bold text-3xl mb-2'>30+</h2>
                                        <p>Operating cities</p>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Teams />
                    <WhyUs />
                    <YourCustomers />
 
            </div>
        </Layout>
        </>
    );
}
