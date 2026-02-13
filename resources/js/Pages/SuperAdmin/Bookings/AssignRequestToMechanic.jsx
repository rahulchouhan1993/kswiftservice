import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { FaPlusCircle, FaUndo } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useAlerts } from '@/Components/Alerts';
import { useForm } from '@inertiajs/react';
import TextAreaWithCount from '@/Components/TextAreaWithCount';
import { Pencil } from 'lucide-react';
import RoundBtn from '@/Components/RoundBtn';
import { GiMechanicGarage } from 'react-icons/gi';

export default function AssignRequestToMechanic({ request }) {
    const [open, setOpen] = useState(false);
    const { successAlert, errorAlert, errorsHandling } = useAlerts();

    console.log('request', request);
    const {
        data,
        setData,
        post,
        reset,
        errors,
        processing
    } = useForm({
        uuid: '',
        note: '',
        garage_id: '',
        accepted_by:'admin',
        booking_id:''
    });

    useEffect(() => {
        if (request) {
            setData(prev => ({
                ...prev,
                uuid: request?.uuid || '',
                garage_id: request?.mechanic?.latest_garage?.[0]?.id ?? '',
                booking_id: request?.booking_id ?? '',
            }));
        }
    }, [request]);



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
            <RoundBtn onClick={() => setOpen(true)}>
                <GiMechanicGarage size={18} />
                <span>Assign mechanic</span>
            </RoundBtn>

            <Modal show={open} maxWidth="md" topCloseButton={true} handleTopClose={closeModal}>
                <h3 className="px-6 py-2 border-b-2 bg-gray-200 dark:bg-[#131836] font-semibold text-lg text-gray-800 dark:text-white">
                    Assign Booking Request to Mechanic
                </h3>
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 dark:bg-[#0a0e25]">
                    <div>
                        <InputLabel htmlFor="note" value="Note *" />
                        <TextAreaWithCount
                            id="note"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            required
                            placeholder="Add a note..."
                        />
                        <InputError className="mt-2" message={errors.note} />
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
