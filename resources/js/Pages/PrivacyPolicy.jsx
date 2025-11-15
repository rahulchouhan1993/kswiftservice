import { Head, Link } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Privacy Policy - KSwift Services" />

            <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12">
                <div className="max-w-4xl mx-auto px-6 py-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl">

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                        Privacy Policy
                    </h1>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-10">
                        Last updated: {new Date().getFullYear()}
                    </p>

                    {/* Content */}
                    <div className="space-y-8 text-lg leading-relaxed">

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
                            <p>
                                Welcome to <strong>KSwift Services</strong>. We value your trust and are committed to protecting your personal information.
                                This Privacy Policy explains how we collect, use, and safeguard your data when you use our services or visit our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
                            <p>We may collect the following types of information:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Personal Information (Name, Email, Phone Number)</li>
                                <li>Account Details</li>
                                <li>Payment & Billing Information</li>
                                <li>Device & Browser Information</li>
                                <li>Usage Data / Log Data</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
                            <p>Your information is used to:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Provide and improve our services</li>
                                <li>Process payments and orders</li>
                                <li>Enhance website experience</li>
                                <li>Communicate updates, offers, or support</li>
                                <li>Ensure security and prevent fraud</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">4. Sharing of Information</h2>
                            <p>
                                We do <strong>not</strong> sell, rent, or trade your personal data.
                                We may share information only in the following cases:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>With trusted service providers (payments, hosting, SMS/Email)</li>
                                <li>To comply with legal requirements</li>
                                <li>To protect the rights of KSwift Services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">5. Cookies & Tracking</h2>
                            <p>
                                We use cookies to improve website performance, analyze traffic, and personalize user experience.
                                You can disable cookies in browser settings at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">6. Data Security</h2>
                            <p>
                                KSwift Services uses industry-standard security practices to protect your information from unauthorized access,
                                misuse, or disclosure. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">7. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Access, update, or delete your data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Request data portability</li>
                                <li>Withdraw consent anytime</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">8. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. Any changes will be posted here with the updated date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy or your data, please contact us at:
                            </p>
                            <p className="mt-3">
                                📧 <strong>Email:</strong> support@kswiftservices.com<br />
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
