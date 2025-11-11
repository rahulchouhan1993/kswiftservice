import React from "react";
import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useAlerts } from "@/Components/Alerts";
import { useHelpers } from "@/Components/Helpers";

export default function Enquiry({ states, cities }) {
    const { successAlert, errorAlert } = useAlerts();
    const { replaceDashWithDot } = useHelpers();

    const { data, setData, post, processing, reset, errors } = useForm({

    });


    return (
        <GuestLayout>
            <Head title="Create Enquiry" />
            <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-[#0a0e37]">
                <div className="sm:p-6 p-4 w-full max-w-4xl">
                    <div className="max-w-md mx-auto mt-20 p-6 bg-white border rounded-2xl shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Wel-Come</h2>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
