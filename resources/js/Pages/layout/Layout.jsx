import React, { useEffect } from 'react'
import Header from '../common/Header'
import Footer from '../home/Footer'
import { useAlerts } from '@/Components/Alerts';
import { usePage } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
    const { successAlert, errorAlert, warningAlert, infoAlert } = useAlerts();
    const { ziggy, flash, errors, messages } = usePage().props;

    useEffect(() => {
        if (errors) {
            Object.entries(errors).forEach(([key, value]) => {
                errorAlert(value);
            });
        }

        if (flash?.success) successAlert(flash.success);
        if (flash?.error) errorAlert(flash.error);
        if (flash?.warning) warningAlert(flash.warning);
        if (flash?.info) infoAlert(flash.info);

        if (messages?.envelopes?.length > 0) {
            messages.envelopes.forEach(({ type, message }) => {
                switch (type) {
                    case 'success':
                        successAlert(message);
                        break;
                    case 'error':
                        errorAlert(message);
                        break;
                    case 'warning':
                        warningAlert(message);
                        break;
                    case 'info':
                        infoAlert(message);
                        break;
                    default:
                        console.warn('Unknown message type:', type);
                }
            });
        }
    }, [messages, flash, errors]);

    return (
        <>
            <Header />
            {children}
            <Footer />
            <Toaster position='top-right' reverseOrder={false} gutter={8} />
        </>
    )
}
