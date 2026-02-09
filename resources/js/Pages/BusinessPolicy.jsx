import { Head } from '@inertiajs/react';
import Layout from './layout/Layout';
import { useTranslation } from 'react-i18next';

export default function BusinessPolicy() {
    const { t } = useTranslation();

    const sections = [
        { key: '1', type: 'text' },
        { key: '2', type: 'text' },
        { key: '3', type: 'text' },
        { key: '4', type: 'list' },
        { key: '5', type: 'list' },
        { key: '6', type: 'text' },
        { key: '7', type: 'text' },
        { key: '8', type: 'text' },
        { key: '9', type: 'text' },
        { key: '10', type: 'text' },
    ];

    return (
        <>
        <Layout>
                    <div className='bg-black'>
                    <Head title={`${t('legal_pages.business_policy.title')} - KSwift Services`} />
                        <div className='relative pt-[100px] '>
                            <div className=" flex items-center w-[90%] h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1px]">
                                <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
                                <div className=" opacity-[70%] md:opacity-[50%] absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
                                [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
                                bg-[length:70px_70px]" ></div>
                            </div>
                            
                            <div className=" relative overflow-hidden">
                                {/* Glowing Grid Pattern Background */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `
                                            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '50px 50px'
                                    }}></div>
                                    <div className="absolute inset-0" style={{
                                        background: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
                                    }}></div>
                                </div>

                                <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                                    
                                    {/* Title */}
                                    <h1 className="px-4 text-2xl md:text-4xl font-bold mb-4 text-center text-white uppercase tracking-wide">
                                        {t('legal_pages.business_policy.title')}
                                    </h1>
                                    <p className="text-center text-sm text-blue-400 mb-16 uppercase tracking-wider">
                                        {t('legal_pages.business_policy.last_updated')}
                                    </p>

                                    {/* Content */}
                                    <div className="space-y-12 text-white leading-relaxed">

                                        {sections.map((section) => (
                                            <section key={section.key}>
                                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">
                                                    {t(`legal_pages.business_policy.sections.${section.key}.title`)}
                                                </h2>
                                                {section.type === 'text' ? (
                                                    <p className="text-gray-200">
                                                        {t(`legal_pages.business_policy.sections.${section.key}.content`)}
                                                    </p>
                                                ) : (
                                                    <div className="text-gray-200 space-y-2">
                                                        {(t(`legal_pages.business_policy.sections.${section.key}.items`, { returnObjects: true }) || []).map((item, index) => (
                                                            <p key={index}>{item}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </section>
                                        ))}

                                    </div>

                                    {/* Footer */}
                                    <footer className="mt-16 text-center text-sm text-gray-400">
                                        {t('legal_pages.business_policy.footer')}
                                    </footer>

                                </div>
                            </div>
                        </div>
                </div>
                </Layout>



        </>
    );
}