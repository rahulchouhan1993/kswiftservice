// Add.jsx
import { useState } from 'react';
import Modal from '@/Components/Modal';
import { FaPlusCircle, FaUndo } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useAlerts } from '@/Components/Alerts';
import { useForm } from '@inertiajs/react';
import { IoMdAddCircle } from 'react-icons/io';
import SelectInput from '@/Components/SelectInput';

export default function AssignMechanic({ mechanics }) {
    const [open, setOpen] = useState();
    const { successAlert, errorAlert, errorsHandling } = useAlerts();

    console.log('mechanics', mechanics);
    const {
        data,
        setData,
        post,
        reset,
        errors,
        processing
    } = useForm({
        mechanic: '',
    });


    const closeModal = () => {
        setOpen(false);
        reset();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            post(route('superadmin.booking.assign.mechanic'), {
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
            </PrimaryButton>

            <Modal show={open} maxWidth="md" topCloseButton={true} handleTopClose={closeModal}>
                <h3 className="px-6 py-2 border-b-2 bg-gray-200 dark:bg-[#131836] font-semibold text-lg text-gray-800 dark:text-white">
                    Assign Mechanic
                </h3>
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 dark:bg-[#0a0e25]">
                    <div>
                        <SelectInput
                            value={data.mechanic}
                            onChange={(e) => setData('mechanic', e.target.value)}
                            options={mechanics.map(m => ({
                                value: m.id,
                                label: m.name
                            }))}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <SecondaryButton type="button" onClick={closeModal}>
                            <FaUndo /> Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit"
                            disabled={processing}
                        >
                            <FaPlusCircle /> {processing ? 'Assigning...' : 'Assign'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
