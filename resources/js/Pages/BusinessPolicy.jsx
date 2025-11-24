import { Head } from '@inertiajs/react';
import Layout from './layout/Layout';

export default function BusinessPolicy() {
    return (
        <>
        <Layout>
                    <div className='bg-black'>
                    <Head title="Privacy Policy - KSwift Services" />
                        <div className='relative pt-[100px] '>
                            <div className=" flex items-center w-[90%] h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1px]">
                                <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
                                <div class=" opacity-[50%] absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
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
                                    <h1 className="text-4xl font-bold mb-4 text-center text-white uppercase tracking-wide">
                                        Business Policy
                                    </h1>
                                    <p className="text-center text-sm text-blue-400 mb-16 uppercase tracking-wider">
                                        LAST UPDATED: OCT 24, 2025
                                    </p>

                                    {/* Content */}
                                    <div className="space-y-12 text-white leading-relaxed">

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">1. INTRODUCTION</h2>
                                            <p className="text-gray-200">
                                                This Business Policy outlines the operational standards and business ethics of KOUSTUBHA FAST SERVICES ("the Company"). It governs the functioning of the platform connecting vehicle owners with independent Partners through the "Swift Service" app.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">2. OBJECTIVE</h2>
                                            <p className="text-gray-200">
                                                To provide transparent, affordable, and efficient vehicle servicing solutions while empowering independent Partners with fair earning opportunities and customers with quality service.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">3. BUSINESS MODEL</h2>
                                            <p className="text-gray-200">
                                                The Company operates as a digital facilitator. Partners and Customers voluntarily interact through the platform. The Company does not employ Partners nor perform services directly.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">4. PAYMENT & CHARGES STRUCTURE</h2>
                                            <div className="text-gray-200 space-y-2">
                                                <p>- Platform Fee: ₹800/day (Partners using company resources), ₹500/day (own resources).</p>
                                                <p>- Commission: 8% of total labour charges.</p>
                                                <p>- GST: 18% on labour and parts (as per SAC 9987 and HSN codes).</p>
                                                <p>- Prices and taxes are subject to government changes.</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">5. BANKS & PAYMENT GATEWAYS CLAUSE</h2>
                                            <div className="text-gray-200 space-y-2">
                                                <p>a) All payments made by Customers are processed through RBI-authorized gateways such as Razorpay and PayU.</p>
                                                <p>b) Accepted methods include UPI, IMPS, NEFT, debit/credit cards, and wallets.</p>
                                                <p>c) All customer collections are routed through the official current account of KOUSTUBHA DAIRY & FARMS and transferred to Partners via NEFT, IMPS, or Wallet transfers.</p>
                                                <p>d) The Company is compliant with PCI-DSS and RBI's data protection regulations.</p>
                                                <p>e) Refunds, if applicable, are processed within 7-10 working days through the same payment channel.</p>
                                                <p>f) Disputes or chargebacks will be resolved under the Payment & Settlement Systems Act, 2007.</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">6. DATA & CONFIDENTIALITY</h2>
                                            <p className="text-gray-200">
                                                All operational data, including Partner and customer details, is confidential and used strictly for business analysis, compliance, and service improvement under the Privacy Policy.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">7. LIABILITY & RESPONSIBILITY</h2>
                                            <p className="text-gray-200">
                                                The Company is not liable for damage, loss, or service disputes arising between Customers and Partners. Both parties act independently. The Company's responsibility ends at providing a secure facilitation platform.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">8. TAXATION & ACCOUNTING</h2>
                                            <p className="text-gray-200">
                                                All financial operations comply with the Indian GST Act and Income Tax regulations. The Company maintains transparent accounting practices and provides tax invoices for every transaction.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">9. COMPLIANCE</h2>
                                            <p className="text-gray-200">
                                                The Company abides by Indian laws, RBI regulations, and Information Technology guidelines. Any breach may lead to suspension or termination from the platform.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">10. LEGAL FRAMEWORK</h2>
                                            <p className="text-gray-200">
                                                All disputes arising from business transactions are subject to arbitration under the Arbitration and Conciliation Act, 1996, and jurisdiction of Bangalore courts.
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
                </div>
                </Layout>



        </>
    );
}