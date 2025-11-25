import { Head, Link } from '@inertiajs/react';
import Layout from './layout/Layout';

export default function PrivacyPolicy() {
    return (
        <Layout>
            <div className=' bg-black'>

            <Head title="Privacy Policy - KSwift Services" />
                <div className='relative pt-[100px] '>
                    <div className=" flex items-center w-[90%] h-[600px] justify-center absolute top-[-70px] left-[5%] p-6 z-[-1px]">
                        <div className='gridmap w-full h-full absolute top-0 left-0 z-[2px]'></div>
                        <div class=" opacity-[50%] absolute w-full h-full  rounded-2xl overflow-hidden z-[1px]
                        [background-image:linear-gradient(to_right,#686868_1px,transparent_1px),linear-gradient(to_bottom,#686868_1px,transparent_1px)]
                        bg-[length:70px_70px]" ></div>
                    </div>
                    <div className=" relative overflow-hidden">
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
                                Privacy Policy
                            </h1>
                            <p className="text-center text-sm text-blue-400 mb-16 uppercase tracking-wider">
                                LAST UPDATED: OCT 24, 2025
                            </p>

                            {/* Content */}
                            <div className="space-y-12 text-white leading-relaxed">

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">1. INFORMATION COLLECTION</h2>
                                    <p className="text-gray-200">
                                        KOUSTUBHA FAST SERVICES collects user information including personal details, contact information, vehicle details, location data, and payment information to facilitate service bookings and improve user experience.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">2. DATA USAGE</h2>
                                    <p className="text-gray-200">
                                        Collected data is used for service facilitation, customer support, payment processing, service improvements, and regulatory compliance. We do not sell or rent user data to third parties.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">3. DATA SHARING</h2>
                                    <div className="text-gray-200 space-y-2">
                                        <p>- Information is shared with verified Partners for service delivery</p>
                                        <p>- Payment data is processed through secure RBI-regulated gateways</p>
                                        <p>- Location data is shared with Partners for service location identification</p>
                                        <p>- Contact information is shared for service coordination</p>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">4. DATA SECURITY</h2>
                                    <div className="text-gray-200 space-y-2">
                                        <p>a) All data transmission uses encrypted SSL/TLS protocols</p>
                                        <p>b) Payment information is tokenized and not stored on our servers</p>
                                        <p>c) Access to user data is restricted to authorized personnel only</p>
                                        <p>d) Regular security audits are conducted to maintain data integrity</p>
                                        <p>e) User authentication uses secure token-based systems</p>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">5. USER RIGHTS</h2>
                                    <div className="text-gray-200 space-y-2">
                                        <p>- Right to access personal information</p>
                                        <p>- Right to update or correct personal data</p>
                                        <p>- Right to request data deletion</p>
                                        <p>- Right to opt-out of marketing communications</p>
                                        <p>- Right to data portability</p>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">6. COOKIES & TRACKING</h2>
                                    <p className="text-gray-200">
                                        The platform uses cookies and similar technologies for session management, user preferences, analytics, and service optimization. Users can manage cookie preferences through browser settings.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">7. THIRD-PARTY SERVICES</h2>
                                    <p className="text-gray-200">
                                        We integrate with third-party services including payment gateways (Razorpay, PayU), mapping services, and communication providers. These services have their own privacy policies and data handling practices.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">8. DATA RETENTION</h2>
                                    <p className="text-gray-200">
                                        User data is retained for the duration necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. Users can request data deletion as per applicable regulations.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">9. CONTACT INFORMATION</h2>
                                    <p className="text-gray-200">
                                        For privacy-related queries, contact our Data Protection Officer at privacy@koustubhafastservices.com or through the contact details provided on our platform.
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
    );
}
