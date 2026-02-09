import { Head, useForm } from "@inertiajs/react";
import Layout from "./layout/Layout";
import InputLabel from "@/Components/InputLabel";
import PhoneInput from "@/Components/PhoneInput";
import { useTranslation } from 'react-i18next';

export default function AccountDelete() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("delete.account"), {
            onSuccess: () => {
                reset();
            }
        });
    };
    return (
        <Layout>
            <Head title="Account Delete" />
            <div className='relative  bg-black'>
                <div className=" flex items-center w-[90%] h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1px]">
                    <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
                    <div class=" opacity-[70%] md:opacity-[50%] absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
                        [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
                        bg-[length:70px_70px]" ></div>
                </div>
                <div className=" pt-[100px] relative overflow-hidden">
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
                            {t('delete_account.title', 'Submit Account Delete Request')}
                        </h1>
                        <p className="text-center text-normal text-main mb-16 uppercase tracking-wider">
                            {t('delete_account.last_updated', 'LAST UPDATED: OCT 24, 2025')}
                        </p>

                        <div data-aos="fade-left" className='w-full relative p-[1px] mb-4 rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800'>
                            <div className='w-full bg-black h-full rounded-[19px]'>
                                <div className="px-6 py-4 border-b border-gray-700 text-start">
                                    <p className="text-white text-lg">{t('delete_account.form_title', 'Send Us a Message')}</p>
                                </div>

                                <form onSubmit={handleSubmit} method="post">
                                    <div className="p-6">

                                        <div className="w-full mt-3">
                                            <InputLabel
                                                className="block text-gray-300 mb-2 uppercase"
                                                value={t('delete_account.phone', 'Phone Number *')}
                                            />
                                            <PhoneInput
                                                id="phone"
                                                className="w-full px-4 py-3 rounded-xl bg-black border border-gray-600 text-white focus:outline-none focus:border-main"
                                                value={data.phone}
                                                onChange={(e) => setData("phone", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn bg-main text-white border-0 mt-4"
                                            disabled={processing}
                                        >
                                            {t('delete_account.submit', 'Submit')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* <div className="space-y-12 text-white leading-relaxed">
                            <section>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">1. ACCEPTANCE OF TERMS</h2>
                                <p className="text-gray-200">
                                    By accessing or using this website or mobile application, the user agrees to comply with and be bound by these Terms and Conditions. If you do not agree, please discontinue use immediately.
                                </p>
                            </section>
                        </div> */}

                        {/* Footer */}
                        <footer className="mt-16 text-center text-sm text-gray-400">
                            {t('delete_account.footer', '© 2025 KOUSTUBHA FAST SERVICES. All rights reserved.')}
                        </footer>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
