import { Head } from '@inertiajs/react';

export default function TermsConditions() {

    return (
        <>
            <Head title="Terms & Conditions - KSwift Services" />

            <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12">
                <div className="max-w-4xl mx-auto px-6 py-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl">

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                        Terms & Conditions
                    </h1>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-10">
                        Last updated: {new Date().getFullYear()}
                    </p>

                    <div className="space-y-8 text-lg leading-relaxed">

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
                            <p>
                                Welcome to <strong>KSwift Services</strong>. These Terms & Conditions outline the rules and
                                regulations for using our website, mobile applications, and services. By accessing or using our
                                services, you agree to comply with these terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">2. Acceptance of Terms</h2>
                            <p>
                                By using our services, you acknowledge that you have read, understood, and agreed to these Terms
                                & Conditions. If you do not agree, you must discontinue using our website or services immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">3. Services Provided</h2>
                            <p>
                                KSwift Services provides digital services, tools, and solutions as listed on our website or platform.
                                We reserve the right to modify, update, or discontinue any service at any time without prior notice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">4. User Responsibilities</h2>
                            <p>By using our platform, you agree that you will:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Provide accurate, complete information during registration</li>
                                <li>Not engage in any illegal or harmful activities</li>
                                <li>Not misuse or attempt to hack our website or systems</li>
                                <li>Maintain the confidentiality of your account and password</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">5. Payments & Billing</h2>
                            <p>
                                All payments made to KSwift Services are secure and processed through trusted payment gateways.
                                Once a service is purchased, the user is responsible for providing accurate billing information.
                            </p>
                            <p className="mt-3">
                                Refunds are subject to our <strong>Refund Policy</strong> (provided separately).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property Rights</h2>
                            <p>
                                All content, designs, graphics, and code on our website are the intellectual property of
                                KSwift Services unless otherwise stated. You may not copy, reproduce, or redistribute our content
                                without written permission from us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
                            <p>
                                KSwift Services is not liable for any direct, indirect, or incidental damages arising from:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Service interruptions or downtime</li>
                                <li>Data loss or security breaches</li>
                                <li>Errors, bugs, or inaccuracies</li>
                            </ul>
                            <p className="mt-3">
                                Use of our services is at your own risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">8. Termination of Use</h2>
                            <p>
                                We reserve the right to suspend or terminate access to our services without prior notice if:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>User violates these Terms & Conditions</li>
                                <li>User engages in harmful or suspicious activity</li>
                                <li>User provides false information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">9. Third-Party Links</h2>
                            <p>
                                Our platform may include links to third-party websites. KSwift Services is not responsible for
                                the content, privacy policies, or practices of those external sites.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
                            <p>
                                We may update these Terms & Conditions at any time. Updates will be posted on this page with the
                                updated date. Continued use of our services means you accept the revised terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms & Conditions, please contact:
                            </p>
                            <p className="mt-3">
                                📧 <strong>Email:</strong> support@kswiftservices.com <br />
                                🌐 <strong>Website:</strong> kswiftservices.com
                            </p>
                        </section>

                    </div>

                    {/* Footer */}
                    <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} KSwift Services. All rights reserved.
                    </footer>

                </div>
            </div>
        </>
    );
}
