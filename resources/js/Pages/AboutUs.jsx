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
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'> 
                    {/* Background Grid - Responsive positioning */}
                    <div className="hidden md:flex items-center w-[90%] h-[400px] md:h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1]">
                        <div className='gridmap w-full h-full absolute top-0 left-0 z-[2] pointer-events-none'></div>
                        <div className="absolute w-full h-full rounded-2xl overflow-hidden z-[1] pointer-events-none
                        [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
                        bg-[length:50px_50px] md:bg-[length:70px_70px]" ></div>
                    </div>
                    
                    {/* Hero Section */}
                    <div className='relative z-10 pt-24 sm:pt-32 md:pt-40 lg:pt-48'>
                        <h1 
                            data-aos="fade-up" 
                            className='text-white mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center max-w-4xl leading-tight font-bold'
                        >
                            Built to Fix How India Maintains Its Vehicles
                        </h1>
                        
                        <div className='max-w-4xl mx-auto text-gray-300 text-center mt-4 sm:mt-6 space-y-3 sm:space-y-4'>
                            <p data-aos="fade-up" className='text-sm sm:text-base md:text-lg leading-relaxed'>
                                This platform was created after recognizing a common problem: people don't trust how their vehicles are serviced, 
                                and Partners don't have the tools or structure to deliver consistent service. Both sides operate manually, 
                                leading to confusion, delays, and disputes.
                            </p>
                            <p data-aos="fade-up" className='text-sm sm:text-base md:text-lg leading-relaxed'>
                                We designed a system that brings clarity and structure to a broken process.
                            </p>
                        </div>
                        
                        {/* Hero Image */}
                        <div className='mt-8 sm:mt-12 md:mt-16 max-w-5xl mx-auto'>
                            <div className='rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl'>
                                <img 
                                    src={aboutimg} 
                                    className='w-full h-auto object-cover' 
                                    alt="About KSwift Service"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mission and Vision Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20'>
                        <div className='fading relative p-[1px] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800'>
                            <div className="bg-dark rounded-xl sm:rounded-2xl overflow-hidden p-5 sm:p-6 md:p-8 h-full">
                                <div className="mb-4 sm:mb-6">
                                    <img 
                                        src={mission} 
                                        className='h-12 w-12 sm:h-14 sm:w-14 object-contain' 
                                        alt="Mission icon"
                                        loading="lazy"
                                    />
                                </div>
                                <h2 className='text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 leading-tight'>
                                    Our Mission
                                </h2>
                                <p className='text-gray-400 text-base sm:text-lg leading-relaxed'>
                                    To revolutionize vehicle maintenance by connecting drivers with trusted Partners through a seamless digital platform, 
                                    ensuring transparency, convenience, and quality service for all.
                                </p>
                            </div>
                        </div>
                        
                        <div className='fading relative p-[1px] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800'>
                            <div className="bg-dark rounded-xl sm:rounded-2xl overflow-hidden p-5 sm:p-6 md:p-8 h-full">
                                <div className="mb-4 sm:mb-6">
                                    <img 
                                        src={vision} 
                                        className='h-12 w-12 sm:h-14 sm:w-14 object-contain' 
                                        alt="Vision icon"
                                        loading="lazy"
                                    />
                                </div>
                                <h2 className='text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 leading-tight'>
                                    Our Vision
                                </h2>
                                <p className='text-gray-400 text-base sm:text-lg leading-relaxed'>
                                    To build a unified, technology-first ecosystem that becomes the standard for vehicle care. 
                                    We aim to give customers consistent, accountable service and empower Partners with a stable, efficient workflow. 
                                    Our vision is a future where quality, transparency, and reliability define every vehicle service.
                                </p>
                            </div>
                        </div>
                    </div>

                    <AboutFeatures />

                     {/* Numbers That Matter Section */}
                     <div className='mt-12 sm:mt-16 md:mt-20'>
                        <div className="rounded-[25px] p-[1px] bg-gradient-to-r from-gray-600 to-gray-800">
                            <div className="bg-black rounded-[25px] relative z-10 w-full mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 text-center">
                            
                                {/* Background blur effect - responsive positioning */}
                                <div className="hidden sm:block absolute top-[100px] sm:top-[120px] md:top-[150px] left-[20%] sm:left-[25%] w-[60%] sm:w-[50%] h-[120px] sm:h-[150px] md:h-[200px] mx-auto bg-main rounded-full filter blur-3xl opacity-1"></div>
                                        
                                <div className="rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative z-1">
                                    <h2 className="fading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white max-w-4xl mx-auto leading-tight">
                                        Numbers That Matter
                                    </h2>
                                    <p className="fading text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                                        Join the thousands of Partners and garages who rely on <span className='text-main2 font-bold'>kswiftservices</span> for a steady stream of verified customers every day.
                                    </p>
                                    
                                    {/* Stats Grid - Mobile first */}
                                    <div className='mb-4 sm:mb-6'>
                                        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto'>
                                            <li className='fading text-white text-center py-4 sm:py-6 border-b sm:border-b-0 sm:border-r border-gray-600 last:border-0'>
                                                <h3 className='font-bold text-3xl sm:text-4xl md:text-5xl mb-2 tracking-tight break-words'>
                                                    50,000+
                                                </h3>
                                                <p className='text-gray-400 text-sm sm:text-base break-words'>
                                                    Happy Customers
                                                </p>
                                            </li>
                                            <li className='fading text-white text-center py-4 sm:py-6 border-b sm:border-b-0 sm:border-r border-gray-600 last:border-0'>
                                                <h3 className='font-bold text-3xl sm:text-4xl md:text-5xl mb-2 tracking-tight break-words'>
                                                    2,000+
                                                </h3>
                                                <p className='text-gray-400 text-sm sm:text-base break-words'>
                                                    Verified Partners
                                                </p>
                                            </li>
                                            <li className='fading text-white text-center py-4 sm:py-6 border-b sm:border-b-0 sm:border-r border-gray-600 last:border-0'>
                                                <h3 className='font-bold text-3xl sm:text-4xl md:text-5xl mb-2 tracking-tight break-words'>
                                                    4.8★
                                                </h3>
                                                <p className='text-gray-400 text-sm sm:text-base break-words'>
                                                    Average Service Rating
                                                </p>
                                            </li>
                                            <li className='fading text-white text-center py-4 sm:py-6'>
                                                <h3 className='font-bold text-3xl sm:text-4xl md:text-5xl mb-2 tracking-tight break-words'>
                                                    30+
                                                </h3>
                                                <p className='text-gray-400 text-sm sm:text-base break-words'>
                                                    Operating Cities
                                                </p>
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
