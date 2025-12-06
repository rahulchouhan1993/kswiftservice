import { useState } from "react";
import Modal from "@/Components/Modal";
import RoundBtn from "@/Components/RoundBtn";
import { MdOutlinePayment } from "react-icons/md";
import { useHelpers } from "@/Components/Helpers";

export default function PaymentDetails({ payment }) {
    const [open, setOpen] = useState(false);
    const { displayInRupee } = useHelpers();
    const closeModal = () => setOpen(false);

    // Convert to array for consistent rendering
    const payments = Array.isArray(payment) ? payment : payment ? [payment] : [];

    const statusColors = {
        success: "text-green-600 dark:text-green-400",
        failed: "text-red-600 dark:text-red-400",
        pending: "text-yellow-600 dark:text-yellow-400",
    };

    return (
        <>
            <RoundBtn onClick={() => setOpen(true)}>
                <MdOutlinePayment />
            </RoundBtn>

            <Modal show={open} maxWidth="md" topCloseButton={true} handleTopClose={closeModal}>
                <h3 className="px-6 py-3 border-b bg-gray-200 dark:bg-[#131836] font-semibold text-lg dark:text-white">
                    Booking Payment Details
                </h3>

                <div className="p-6 space-y-6 dark:bg-[#0a0e25] max-h-[70vh] overflow-y-auto">
                    {payments.length === 0 ? (
                        <p className="text-gray-500 text-sm">No payment records found.</p>
                    ) : (
                        payments.map((p, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4 bg-white dark:bg-[#131836] dark:border-gray-700 shadow-sm"
                            >
                                <h4 className="font-semibold text-md mb-3 text-gray-800 dark:text-gray-200">
                                    Payment #{index + 1}
                                </h4>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Txn ID:</span>
                                        <span>{p?.txnId || "--"}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                                        <span>{displayInRupee(p?.amount)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Payment Mode:</span>
                                        <span className="uppercase">{p?.payment_mode || "--"}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                        <span className={`font-semibold capitalize ${statusColors[p?.status]}`}>
                                            {p?.status || "--"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                                        <span>
                                            {p?.created_at
                                                ? new Date(p.created_at).toLocaleString()
                                                : "--"}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </>
    );
}
