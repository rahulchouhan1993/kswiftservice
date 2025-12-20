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

export default function Add({ states, cities }) {
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
        user_type: 'mechanic',
        address_type: '',
        name: '',
        email: '',
        phone: '',
        whatsapp_phone: '',
        state_id: '',
        city_id: '',
        address: '',
        pincode: '',
        dob: '',
        photo: '',
        password: '',
        password_confirmation: '',
    });


    const closeModal = () => {
        setOpen(false);
        reset();
    }

    const handleStateChange = ({ state_id, city_id }) => {
        setData("state_id", state_id);
        setData("city_id", city_id);
    };

    const userTypeOptions = [
        { value: "customer", label: "Customer" },
        { value: "mechanic", label: "Mechanic" },
    ];

    const addressTypeOptions = [
        { value: "home", label: "Home" },
        { value: "office", label: "Office" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            post(route('superadmin.mechanic.add'), {
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
            <PrimaryButton
                onClick={(e) => setOpen(true)}
            >
                <IoMdAddCircle />
                Add
            </PrimaryButton>

            <Modal show={open} maxWidth="md" topCloseButton={true} handleTopClose={closeModal}>
                <h3 className="px-6 py-2 border-b-2 bg-gray-200 dark:bg-[#131836] font-semibold text-lg text-gray-800 dark:text-white">
                    Add Mechanic
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
                        <InputLabel htmlFor="email" value="Email *" />
                        <TextInput
                            id="email"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                        <InputLabel htmlFor="whatsapp_phone" value="Whatsapp Phone *" />
                        <PhoneInput
                            id="whatsapp_phone"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.whatsapp_phone}
                            onChange={(e) => setData('whatsapp_phone', e.target.value)}
                            required
                            placeholder="Whatsapp Phone..."
                        />
                        <InputError className="mt-2" message={errors.whatsapp_phone} />
                    </div>

                    <div>
                        <StateCitySelect
                            states={states}
                            cities={cities}
                            value={{ state_id: data.state_id, city_id: data.city_id }}
                            onChange={handleStateChange}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="address" value="Address *" />
                        <TextAreaWithCount
                            id="address"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            required
                            placeholder="Address..."
                        />
                        <InputError className="mt-2" message={errors.address} />
                    </div>

                    <div>
                        <InputLabel htmlFor="pincode" value="Pincode *" />
                        <DigitsInput
                            id="pincode"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.pincode}
                            onChange={(e) => setData('pincode', e.target.value)}
                            required
                            placeholder="Pincode..."
                        />
                        <InputError className="mt-2" message={errors.pincode} />
                    </div>

                    <div>
                        <InputLabel htmlFor="address_type" value="Address Type *" />
                        <SelectInput
                            id="address_type"
                            value={data.address_type}
                            onChange={(e) => setData('address_type', e.target.value)}
                            options={addressTypeOptions}
                            placeholder="-Select-"
                        />
                        <InputError className="mt-2" message={errors.address_type} />
                    </div>

                    <div>
                        <InputLabel htmlFor="dob" value="Date Of Birth" />
                        <TextInput
                            id="dob"
                            type="date"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.dob}
                            onChange={(e) => setData('dob', e.target.value)}
                            placeholder="Date Of Birth..."
                        />
                        <InputError className="mt-2" message={errors.dob} />
                    </div>

                    <div className="flex gap-2">
                        <div className="w-full mb-2">
                            <InputLabel htmlFor="password" value="Password *" />
                            <TextInput
                                type="password"
                                id="password"
                                className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="*******"
                            />
                            <InputError className="mt-2" message={errors.password} />
                        </div>

                        <div className="w-full mb-2">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password *" />
                            <TextInput
                                type="password"
                                id="password_confirmation"
                                className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
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
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <SecondaryButton type="button" onClick={closeModal}>
                            <FaUndo /> Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit"
                            disabled={processing}
                        >
                            <FaPlusCircle /> {processing ? 'Adding...' : 'Add'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
