import { Head } from '@inertiajs/react';
import Layout from './layout/Layout';

export default function CustomerTermsConditions() {
    return (
        <>

        <Layout>
                    <div className=' bg-black'>
        
                    <Head title="Privacy Policy - KSwift Services" />
                        <div className='relative pt-[100px] '>
                            <div className=" flex items-center w-[90%] h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1px]">
                                <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
                                <div class=" opacity-[70%] md:opacity-[50%] absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
                                [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
                                bg-[length:70px_70px]" ></div>
                            </div>
                            <div className="  relative overflow-hidden">
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
                                        Customer Terms & Conditions Agreement
                                    </h1>
                                    <p className="text-center text-sm text-blue-400 mb-16 uppercase tracking-wider">
                                        LAST UPDATED: OCT 24, 2025
                                    </p>

                                    {/* Content */}
                                    <div className="space-y-12 text-white leading-relaxed">

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">1. INTRODUCTION</h2>
                                            <p className="text-gray-200">
                                                This Agreement governs the relationship between the Customer and KOUSTUBHA FAST SERVICES ("the Company") when using the Swift Service mobile or web application for vehicle repair and maintenance bookings.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">2. SERVICE SCOPE</h2>
                                            <p className="text-gray-200">
                                                The Company operates as a digital platform facilitating the connection between Customers and independent Partners. The Company does not provide repair services directly but enables transparent communication, tracking, and payment systems.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">3. CUSTOMER RESPONSIBILITIES</h2>
                                            <div className="text-gray-200 space-y-2">
                                                <p>- Customers shall provide accurate details regarding vehicle type, issue, and location.</p>
                                                <p>- Customers must ensure availability at the chosen service slot.</p>
                                                <p>- Payment must be made only through approved channels integrated into the application.</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">4. SERVICE DELIVERY</h2>
                                            <p className="text-gray-200">
                                                Upon job confirmation, a verified Partner will visit the Customer's specified location to perform the service. Customers are encouraged to review pre-work and post-work photos before making payment.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">5. SPARES & CONSUMABLES</h2>
                                            <p className="text-gray-200">
                                                Spares and consumables used in services are mutually procured by the Customer and Partner. The Company is not responsible for supply, warranty, or quality of any consumable or spare part.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">6. PAYMENTS & CHARGES</h2>
                                            <div className="text-gray-200 space-y-2">
                                                <p>- Charges will be shown to the Customer before confirmation of the booking.</p>
                                                <p>- Payments can be made through UPI, Debit/Credit cards, Internet Banking, IMPS, NEFT, or Wallets integrated via authorized gateways.</p>
                                                <p>- GST applicable (18%) on labour and parts, billed separately as per law.</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">7. BANKS & PAYMENT GATEWAYS CLAUSE</h2>
                                            <div className="text-gray-200 space-y-2">
                                                <p>a) All transactions are processed through RBI-approved payment gateways such as Razorpay or PayU.</p>
                                                <p>b) Accepted payment methods include UPI, IMPS, NEFT, debit/credit cards, and digital wallets.</p>
                                                <p>c) Amounts collected from the Customer are credited to the Company's current account and subsequently transferred to the Partner after applicable deductions (GST, platform fees, commission).</p>
                                                <p>d) The Company follows PCI-DSS and RBI compliance guidelines; no payment credentials are stored.</p>
                                                <p>e) Refunds (if applicable) are processed within 7-10 working days, subject to bank and gateway timelines.</p>
                                                <p>f) Disputes or fraudulent transactions will be handled as per the Payment & Settlement Systems Act, 2007 and RBI circulars.</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">8. CANCELLATION & REFUND POLICY</h2>
                                            <div className="text-gray-200 space-y-2">
                                                <p>- Jobs canceled before Partner assignment incur no charges.</p>
                                                <p>- Jobs canceled after Partner dispatch may attract a nominal visit fee.</p>
                                                <p>- Refunds are processed in accordance with gateway timelines and refund rules.</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">9. DATA PRIVACY</h2>
                                            <p className="text-gray-200">
                                                All customer information is protected under the Company's Privacy Policy and the Information Technology Act, 2000. Data may be used internally for service analytics and quality improvement.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">10. LIABILITY DISCLAIMER</h2>
                                            <p className="text-gray-200">
                                                The Company is not liable for damages or loss arising from third-party actions, parts malfunction, or Partner negligence. Customers are advised to verify all service details before final acceptance.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">11. GOVERNING LAW & ARBITRATION</h2>
                                            <p className="text-gray-200">
                                                This Agreement shall be governed by Indian law. All disputes shall be resolved through arbitration in Bangalore in accordance with the Arbitration and Conciliation Act, 1996.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">12. ACCEPTANCE</h2>
                                            <p className="text-gray-200">
                                                By proceeding with booking or payment, the Customer agrees to these Terms and Conditions in full and acknowledges that the Company acts solely as a facilitation platform.
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