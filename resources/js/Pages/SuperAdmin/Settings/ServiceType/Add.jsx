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
import DigitsInput from '@/Components/DigitsInput';

export default function Add() {
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
        name: '',
        vehicle_type: '',
        base_price: '',
    });

    const closeModal = () => {
        setOpen(false);
        reset();
    }

    const vehicleOptions = [
        { value: "bike", label: "Bike" },
        { value: "car", label: "Car" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            post(route('superadmin.settings.service.type.create'), {
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
                    Add Service Type
                </h3>
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 dark:bg-[#0a0e25]">
                    <div>
                        <InputLabel htmlFor="vehicle_type" value="Vehicle Type *" />
                        <SelectInput
                            id="vehicle_type"
                            value={data.vehicle_type}
                            onChange={(e) => setData('vehicle_type', e.target.value)}
                            options={vehicleOptions}
                            placeholder="-Select-"
                        />
                        <InputError className="mt-2" message={errors.vehicle_type} />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value="Service Type Name *" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Service Type Name..."
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="base_price" value="Base Price *" />
                        <DigitsInput
                            id="base_price"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.base_price}
                            onChange={(e) => setData('base_price', e.target.value)}
                            required
                            placeholder="Base Price..."
                        />
                        <InputError className="mt-2" message={errors.base_price} />
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
