import { useAlerts } from '@/Components/Alerts';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useHelpers } from '@/Components/Helpers';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function UpdatePasswordForm({ user, className = '' }) {
    const { errorsHandling } = useAlerts();
    const { generateRandomPassword } = useHelpers();

    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, post, processing } = useForm({
        password: '',
        password_confirmation: '',
    });

    /** Generate Password */
    const handleGeneratePassword = () => {
        const pwd = generateRandomPassword(12);
        setData("password", pwd);
        setData("password_confirmation", pwd);
        navigator.clipboard.writeText(pwd);
    };

    const confirmSubmit = async () => {
        await handleSubmit();
        setShowConfirm(false);
    };

    const handleSubmit = (e) => {
        if (e?.preventDefault) e.preventDefault();

        try {
            post(route("superadmin.user.update.password", { uuid: user?.uuid }), {
                preserveScroll: true,
                onSuccess: () => setShowConfirm(false),
                onError: (error) => console.error("Failed:", error)
            });
        } catch (error) {
            errorsHandling(error);
        }
    };

    return (
        <section
            className={`
                w-full
                bg-white dark:bg-blue-950
                rounded-2xl
                shadow-xl
                border border-gray-200 dark:border-blue-900
                p-6 space-y-8
                transition-all duration-300
                ${className}
            `}
        >
            {/* HEADER */}
            <header className="pb-4 border-b border-gray-200 dark:border-blue-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Update Password
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Ensure your account uses a strong and secure password.
                </p>
            </header>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* PASSWORD + GENERATE BUTTON */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <InputLabel htmlFor="password" value="New Password *" />
                        <button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="
                                text-xs px-3 py-1 rounded-lg
                                bg-blue-600 text-white
                                hover:bg-blue-700
                                transition-all shadow-sm
                            "
                        >
                            Generate Password
                        </button>
                    </div>

                    <TextInput
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="text"
                        className="mt-1 block w-full rounded-xl"
                        required
                        placeholder="Enter new password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password *" />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="text"
                        className="mt-1 block w-full rounded-xl"
                        required
                        placeholder="Re-enter password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex justify-end pt-4">
                    <PrimaryButton
                        type="button"
                        disabled={processing}
                        onClick={() => setShowConfirm(true)}
                        className="px-6 py-2 text-sm rounded-xl"
                    >
                        {processing ? "Saving..." : "Save Password"}
                    </PrimaryButton>
                </div>
            </form>

            {/* CONFIRM DIALOG */}
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmSubmit}
                message="Are you sure you want to update this user's password?"
                confirmText="Yes, Update"
                cancelText="Cancel"
            />
        </section>
    );
}
