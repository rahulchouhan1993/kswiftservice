import { Head } from '@inertiajs/react';
import Layout from './layout/Layout';

export default function TermsConditions() {

    return (
        <Layout>
            <Head title="Terms & Conditions - KSwift Services" />

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
                            Terms & Conditions
                        </h1>
                        <p className="text-center text-normal text-main mb-16 uppercase tracking-wider">
                            LAST UPDATED: OCT 24, 2025
                        </p>

                        <div className="space-y-12 text-white leading-relaxed">

                            <section>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">1. ACCEPTANCE OF TERMS</h2>
                                <p className="text-gray-200">
                                    By accessing or using this website or mobile application, the user agrees to comply with and be bound by these Terms and Conditions. If you do not agree, please discontinue use immediately.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">2. SERVICE SCOPE</h2>
                                <p className="text-gray-200">
                                    KOUSTUBHA FAST SERVICES operates as an intermediary platform connecting customers with verified Partners. The Company does not perform any vehicle repair or servicing directly. Services are rendered independently by the Partners.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">3. ELIGIBILITY</h2>
                                <p className="text-gray-200">
                                    Users must be at least 18 years old and capable of entering into legally binding contracts under Indian law.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">4. USER RESPONSIBILITIES</h2>
                                <p className="text-gray-200">
                                    Users must provide accurate details while booking services and shall not misuse the platform for illegal or fraudulent purposes.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">5. PAYMENT TERMS</h2>
                                <div className="text-gray-200 space-y-2">
                                    <p>- All charges for services will be displayed before booking confirmation.</p>
                                    <p>- Payments are processed through authorized payment gateways integrated into the platform.</p>
                                    <p>- Applicable GST (18%) is included in service invoices as per SAC 9987 and HSN codes.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">6. BANKS & PAYMENT GATEWAYS CLAUSE</h2>
                                <div className="text-gray-200 space-y-2">
                                    <p>a) All payments are processed through RBI-regulated gateways such as Razorpay and PayU.</p>
                                    <p>b) Accepted modes include UPI, IMPS, NEFT, debit/credit cards, and digital wallets.</p>
                                    <p>c) Funds collected from customers are routed to KOUSTUBHA DAIRY & FARMS' official current account and then transferred to the respective Partner after deductions (commission, GST, platform fees).</p>
                                    <p>d) The Company complies with PCI-DSS and RBI's data security guidelines.</p>
                                    <p>e) Refunds, where applicable, will be processed within 7-10 working days through the original payment mode.</p>
                                    <p>f) The Company is not responsible for delays caused by banks or payment intermediaries.</p>
                                    <p>g) Any fraudulent or disputed transactions will be handled as per the Payment & Settlement Systems Act, 2007.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">7. CANCELLATION & REFUND POLICY</h2>
                                <p className="text-gray-200">
                                    Details regarding cancellation and refund policies will be provided separately and form an integral part of these terms.
                                </p>
                            </section>

                        </div>

                        {/* Footer */}
                        <footer className="mt-16 text-center text-sm text-gray-400">
                            © 2025 KOUSTUBHA FAST SERVICES. All rights reserved.
                        </footer>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
