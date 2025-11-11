import { Head } from '@inertiajs/react';
import { useState } from "react"
import AuthenticatedLayout from './Layouts/AuthenticatedLayout';
const rowsPerPage = 5;

export default function Dashboard({ branches }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (

        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="pt-[57px]">
                <div>
                    <div className="min-h-screen dark:bg-[#0a0e25] bg-gray-100 text-white p-2 sm:p-4 md:p-6">

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
