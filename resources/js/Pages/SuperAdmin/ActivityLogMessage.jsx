import { useState } from 'react';
import Modal from '@/Components/Modal';
import RoundBtn from '@/Components/RoundBtn';
import { FaRegEye } from 'react-icons/fa6';

export default function ActivityLogMessage({ log }) {
    const [open, setOpen] = useState(false);

    const closeModal = () => setOpen(false);

    return (
        <>
            <RoundBtn onClick={() => setOpen(true)}>
                <FaRegEye /> Check Details
            </RoundBtn>

            <Modal
                show={open}
                maxWidth="md"
                topCloseButton
                handleTopClose={closeModal}
            >
                {/* Header */}
                <div className="px-6 py-3 border-b bg-gray-100 dark:bg-[#131836]">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        Activity Log Details
                    </h3>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-4 text-sm">
                    {/* Title */}
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Title
                        </p>
                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                            {log?.title || '—'}
                        </p>
                    </div>

                    {/* Message */}
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Message
                        </p>
                        <div className="max-h-60 overflow-y-auto">
                            {log?.message || '—'}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t bg-gray-50 dark:bg-[#0f1435] flex justify-end">
                    <button
                        onClick={closeModal}
                        className="text-sm px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
}
