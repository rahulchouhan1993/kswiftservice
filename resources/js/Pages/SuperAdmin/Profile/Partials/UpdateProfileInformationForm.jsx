import { useAlerts } from '@/Components/Alerts';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PhoneInput from '@/Components/PhoneInput';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ className = '' }) {
    const user = usePage().props.auth.user;
    const { successAlert, errorAlert, errorsHandling } = useAlerts();
    const { data, setData, post, errors, processing } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            whatsapp_phone: user.whatsapp_number,
        });

    const submit = (e) => {
        e.preventDefault();
        try {
            post(route('superadmin.update.profile'), {
                preserveScroll: true,
                onSuccess: (resp) => {
                    closeModal()
                }
            });
        } catch (error) {
            errorsHandling(error)
        }
    }

    return (
        <section className={className}>
            <header className=''>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Update Profile
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name *" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email *" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone *" />
                    <PhoneInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data?.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                </div>

                <div>
                    <InputLabel htmlFor="whatsapp_phone" value="WhatsApp Phone *" />
                    <PhoneInput
                        id="whatsapp_phone"
                        className="mt-1 block w-full"
                        value={data?.whatsapp_phone}
                        onChange={(e) => setData('whatsapp_phone', e.target.value)}
                        required
                    />
                </div>

                <div className="w-full flex items-center justify-end gap-4">
                    <div className='flex space-x-2 items-center'>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Submitting..' : 'Submit'}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </section>
    );
}
