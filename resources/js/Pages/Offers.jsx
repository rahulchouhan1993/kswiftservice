import { Head } from '@inertiajs/react';
import Layout from './layout/Layout';

export default function Offers() {

    return (
        <>
            <Layout>
                <Head title="Offers" />
                <div className='container mx-auto'>
                    <div className=''>
                        <div className=" items-center w-[90%] h-[400px] md:h-[600px] justify-center absolute top-[-70px] left-[5%]  z-[-1]">
                            <div className='gridmap w-full h-full absolute top-0 left-0 z-[2] pointer-events-none'></div>
                            <div className="absolute w-full h-full rounded-2xl overflow-hidden z-[1] pointer-events-none [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)] bg-[length:50px_50px] md:bg-[length:70px_70px]" ></div>
                        </div>

                        {/* Hero Section */}
                        <div className='relative z-10 pt-32 sm:pt-32 md:pt-40 lg:pt-48'>
                            <h1
                                data-aos="fade-up"
                                className='text-white mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center max-w-4xl leading-tight font-bold'
                            >
                                We are updating offers
                            </h1>

                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
