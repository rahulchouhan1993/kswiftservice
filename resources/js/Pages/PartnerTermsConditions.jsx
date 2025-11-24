import { Head } from '@inertiajs/react';
import Layout from './layout/Layout';

export default function PartnerTermsConditions() {
    return (
        <>
        <Layout>
                    <Head title="Terms & Conditions - KSwift Services" />
        
                    <div className='relative  bg-black'>
                            <div className=" flex items-center w-[90%] h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1px]">
                                <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
                                <div class=" opacity-[50%] absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
                                [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
                                bg-[length:70px_70px]" ></div>
                            </div>
                          <div className=" pt-[100px] relative overflow-hidden">
                            <div className="relative overflow-hidden">
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
                                        Partner Terms & Conditions Agreement
                                    </h1>
                                    <p className="text-center text-sm text-blue-400 mb-16 uppercase tracking-wider">
                                        LAST UPDATED: OCT 24, 2025
                                    </p>

                                    {/* Content */}
                                    <div className="space-y-12 text-white leading-relaxed">

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">1. PARTIES</h2>
                                            <p className="text-gray-200">
                                                This Agreement is entered into between KOUSTUBHA FAST SERVICES ("the Company") and the undersigned Partner Partner ("the Partner"), identified by Aadhaar and registered mobile number.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">2. NATURE OF RELATIONSHIP</h2>
                                            <p className="text-gray-200">
                                                The Company operates as a digital facilitation platform connecting customers seeking vehicle services with independent Partners. The Partner acts as an independent contractor and voluntarily participates in the platform. The Company's role is limited to facilitation.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">3. PARTNER RESPONSIBILITY</h2>
                                            <p className="text-gray-200">
                                                The Partner is fully responsible for workmanship, safety, and service outcomes. Any damage, negligence, or legal issue during the job shall be solely borne by the Partner.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">4. COMPANY DISCLAIMER</h2>
                                            <p className="text-gray-200">
                                                The Company only provides a platform for booking and coordination and is not responsible for vehicle condition, tools, or any loss or dispute arising during or after service.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">5. SERVICE ENGAGEMENT</h2>
                                            <p className="text-gray-200">
                                                Partners may accept or reject service requests. Upon acceptance, they must complete diagnostics, obtain approval, upload pre- and post-work photos, and close the job with customer confirmation.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">6. PLATFORM USAGE & PAYMENT POLICY</h2>
                                            <div className="text-gray-200 space-y-4">
                                                <div>
                                                    <p className="font-semibold">A. Platform Charges:</p>
                                                    <div className="ml-4 space-y-1">
                                                        <p>- ₹800/day if using company resources, garage, or tools.</p>
                                                        <p>- ₹500/day if using personal tools and resources.</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">B. Labour Commission:</p>
                                                    <div className="ml-4">
                                                        <p>- The Company will deduct 8% from the total labour charges as a facilitation fee.</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">C. GST & Taxation:</p>
                                                    <div className="ml-4 space-y-1">
                                                        <p>- Labour (SAC 9987): 18% GST (9% CGST + 9% SGST).</p>
                                                        <p>- Parts/Spares: 18% under applicable HSN codes.</p>
                                                        <p>- GST changes per government notification are automatically applicable.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">7. BANKS & PAYMENT GATEWAYS CLAUSE</h2>
                                            <div className="text-gray-200 space-y-2">
                                                <p>a) All online payments are securely processed through RBI-registered payment gateways such as Razorpay or PayU.</p>
                                                <p>b) Accepted payment methods include UPI, IMPS, NEFT, debit/credit cards, and digital wallets.</p>
                                                <p>c) Collections from customers are credited to the official current account of KOUSTUBHA DAIRY & FARMS and settled to Partners via NEFT, IMPS, or Wallet transfer after deduction of applicable charges and taxes.</p>
                                                <p>d) The Company complies with PCI-DSS and RBI data protection regulations and does not store card details.</p>
                                                <p>e) Refunds or reversals, if applicable, will be processed within 7-10 working days via the original payment method, subject to banking timelines.</p>
                                                <p>f) Any fraudulent or disputed transactions will be handled as per the Payment & Settlement Systems Act, 2007 and Indian banking norms.</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">8. DATA PRIVACY & AADHAAR E-SIGN</h2>
                                            <p className="text-gray-200">
                                                The Partner consents to Aadhaar-based digital signing of this Agreement. Data is stored securely under the Information Technology Act, 2000 and UIDAI e-Sign Regulations.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">9. INDEMNITY</h2>
                                            <p className="text-gray-200">
                                                The Partner agrees to indemnify and hold harmless KOUSTUBHA DAIRY & FARMS and its affiliates from any claim, loss, or liability arising out of their service actions.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">10. GOVERNING LAW & ARBITRATION</h2>
                                            <p className="text-gray-200">
                                                This Agreement is governed by Indian law and subject to arbitration in Bangalore under the Arbitration and Conciliation Act, 1996.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">11. ACKNOWLEDGMENT</h2>
                                            <p className="text-gray-200">
                                                By e-signing, the Partner confirms understanding of all terms, assumes full responsibility for service quality, and accepts that the Company is not liable for operational or financial outcomes.
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
            <Head title="Partner Terms & Conditions Agreement - KSwift Services" />

        </>
    );
}