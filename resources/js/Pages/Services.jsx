import { Head, Link } from '@inertiajs/react';

export default function Services() {

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Services Page
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
