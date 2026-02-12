// Add.jsx
import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { FaPlusCircle, FaUndo } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useAlerts } from '@/Components/Alerts';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import TextAreaWithCount from '@/Components/TextAreaWithCount';
import { Pencil } from 'lucide-react';
import RoundBtn from '@/Components/RoundBtn';

export default function ManageStatus({ request }) {
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
        status: '',
        note: '',
        rejection_reason: '',
        astimated_payment_date: '',
    });

    console.log('request', request);    
    useEffect(() => {
        if (request?.uuid) {
            setData('uuid', request.uuid);
        }
    }, [request]);

    const closeModal = () => {
        setOpen(false);
        reset();
    }

    const statusOptions = [
        { value: "accept", label: "Accept" },
        { value: "reject", label: "Reject" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            post(route('superadmin.withdrawal.update.status'), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onError: (errors) => {
                    console.log(errors);
                    errorAlert("Something went wrong");
                }
            });
        } catch (error) {
            errorsHandling(error)
        }
    }

    return (
        <>
            <RoundBtn onClick={() => setOpen(true)}>
                <Pencil size={18} />
                <span>Manage Withdrawal</span>
            </RoundBtn>

            <Modal show={open} maxWidth="md" topCloseButton={true} handleTopClose={closeModal}>
                <h3 className="px-6 py-2 border-b-2 bg-gray-200 dark:bg-[#131836] font-semibold text-lg text-gray-800 dark:text-white">
                    Manage Withdrawal Request
                </h3>
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 dark:bg-[#0a0e25]">
                    <div>
                        <InputLabel htmlFor="status" value="Status *" />
                        <SelectInput
                            id="status"
                            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            options={statusOptions}
                            required
                        />
                        <InputError className="mt-2" message={errors.status} />   
                    </div>

                    {data.status === 'reject' && (
                        <div>
                            <InputLabel htmlFor="rejection_reason" value="Rejection Reason *" />
                            <TextAreaWithCount
                                id="rejection_reason"
                                className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                                value={data.rejection_reason}
                                onChange={(e) => setData('rejection_reason', e.target.value)}
                                placeholder="Enter rejection reason..."
                            />
                            <InputError className="mt-2" message={errors.rejection_reason} />   
                        </div>
                    )}

                    {data.status === 'accept' && (
                        <>
                            <div>
                                <InputLabel htmlFor="astimated_payment_date" value="Estimated Payment Date *" />
                                <TextInput
                                    type="date"
                                    id="astimated_payment_date"
                                    className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                                    value={data.astimated_payment_date}
                                    required
                                    onChange={(e) => setData('astimated_payment_date', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.astimated_payment_date} />   
                            </div>

                            <div>
                                <InputLabel htmlFor="note" value="Note" />
                                <TextAreaWithCount
                                    id="note"
                                    className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]"
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    placeholder="Enter note..."
                                />
                                <InputError className="mt-2" message={errors.note} />   
                            </div>
                        </>
                    )}

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
