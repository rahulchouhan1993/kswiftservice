// Add.jsx
import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { FaPlusCircle, FaUndo } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useAlerts } from '@/Components/Alerts';
import { useHelpers } from '@/Components/Helpers';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { IoMdAddCircle } from 'react-icons/io';
import PhoneInput from '@/Components/PhoneInput';
import TextAreaWithCount from '@/Components/TextAreaWithCount';
import DigitsInput from '@/Components/DigitsInput';
import CustomDateInput from '@/Components/CustomDateInput';
import StateCitySelect from '@/Components/StateCitySelect';
import FileInputWithPreview from '@/Components/FileInputWithPreview';
import Button from '@/Components/Button';
import EditBtn from '@/Components/EditBtn';
import { Pencil } from 'lucide-react';

export default function Edit({ user, states, cities }) {
    const [open, setOpen] = useState();
    const { successAlert, errorAlert, errorsHandling } = useAlerts();

    const {
        data,
        setData,
        post,
        reset,
        errors,
        processing
    } = useForm({
        uuid: '',
        user_type: 'mechanic',
        name: '',
        email: '',
        phone: '',
        whatsapp_phone: '',
        dob: '',
        photo: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (user) {
            setData({
                uuid: user?.uuid,
                user_type: user?.role || '',
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                whatsapp_phone: user?.whatsapp_number || '',
                dob: user?.dob || '',
                photo: '',
                profile_photo_url: user?.profile_photo_url || ''
            });
        }
    }, [user]);


    const closeModal = () => {
        setOpen(false);
        reset();
    }

    const userTypeOptions = [
        { value: "customer", label: "Customer" },
        { value: "mechanic", label: "Mechanic" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            post(route('superadmin.mechanic.update', { uuid: data?.uuid }), {
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
        <>
            <EditBtn
                onClick={(e) => setOpen(true)}
            >
                <Pencil size={18} />
            </EditBtn>

            <Modal show={open} maxWidth="md" topCloseButton={true} handleTopClose={closeModal}>
                <h3 className="px-6 py-2 border-b-2 bg-gray-200 dark:bg-[#131836] font-semibold text-lg text-gray-800 dark:text-white">
                    Update Mechanic
                </h3>
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 dark:bg-[#0a0e25]">
                    <div>
                        <InputLabel htmlFor="name" value="Name *" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Name..."
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email..."
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Phone *" />
                        <PhoneInput
                            id="phone"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                            placeholder="Phone..."
                        />
                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="whatsapp_phone" value="Whatsapp Phone" />
                        <PhoneInput
                            id="whatsapp_phone"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.whatsapp_phone}
                            onChange={(e) => setData('whatsapp_phone', e.target.value)}
                            placeholder="Whatsapp Phone..."
                        />
                        <InputError className="mt-2" message={errors.whatsapp_phone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="dob" value="Date Of Birth" />
                        <CustomDateInput
                            id="dob"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.dob}
                            onChange={(e) => setData('dob', e.target.value)}
                            placeholder="Date Of Birth..."
                        />
                        <InputError className="mt-2" message={errors.dob} />
                    </div>

                    <div className="flex gap-2">
                        <div className="w-full mb-2">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                type="password"
                                id="password"
                                className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="*******"
                            />
                            <InputError className="mt-2" message={errors.password} />
                        </div>

                        <div className="w-full mb-2">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                type="password"
                                id="password_confirmation"
                                className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="*******"
                            />
                            <InputError className="mt-2" message={errors.password_confirmation} />
                        </div>
                    </div>

                    <div>
                        <FileInputWithPreview
                            name="photo"
                            label="Photo"
                            setData={setData}
                            error={errors.photo}
                            width="w-24"
                            height="h-24"
                            rounded="rounded-md"
                            defaultImage={data?.profile_photo_url}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <SecondaryButton type="button" onClick={closeModal}>
                            <FaUndo /> Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit"
                            disabled={processing}
                        >
                            <FaPlusCircle /> {processing ? 'Updating...' : 'Update'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
