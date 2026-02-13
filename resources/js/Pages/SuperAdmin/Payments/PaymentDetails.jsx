import { useState } from "react";
import Modal from "@/Components/Modal";
import RoundBtn from "@/Components/RoundBtn";
import { MdOutlinePayment } from "react-icons/md";
import { useHelpers } from "@/Components/Helpers";
import LinkPdfDownloadButton from "@/Components/LinkPdfDownloadButton";

export default function PaymentDetails({ payment }) {
    const [open, setOpen] = useState(false);
    const { displayInRupee } = useHelpers();

    const payments = Array.isArray(payment) ? payment : payment ? [payment] : [];

    const statusColors = {
        completed: "text-green-600 dark:text-green-400",
        success: "text-green-600 dark:text-green-400",
        failed: "text-red-600 dark:text-red-400",
        pending: "text-yellow-600 dark:text-yellow-400",
    };

    return (
        <>
            <RoundBtn onClick={() => setOpen(true)}>
                <MdOutlinePayment />
                <span>Payment Info</span>
            </RoundBtn>

            <Modal show={open} maxWidth="md" topCloseButton handleTopClose={() => setOpen(false)}>
                <h3 className="px-6 py-3 border-b bg-gray-200 dark:bg-[#131836] font-semibold text-lg dark:text-white">
                    Payment Details
                </h3>

                <div className="p-6 space-y-6 dark:bg-[#0a0e25] max-h-[70vh] overflow-y-auto">
                    {payments.length === 0 ? (
                        <p className="text-gray-500 text-sm">No payment records found.</p>
                    ) : (
                        payments.map((p, index) => (
                            <div
                                key={p.uuid || index}
                                className="border rounded-lg p-4 bg-white dark:bg-[#131836] dark:border-gray-700 shadow-sm"
                            >
                                <h4 className="font-semibold text-md mb-3 text-gray-800 dark:text-gray-200">
                                    Payment #{index + 1}
                                </h4>

                                <div className="space-y-2 text-sm">

                                    <Info
                                        label="Amount"
                                        value={displayInRupee(p?.amount)}
                                    />

                                    {/* Transaction ID only if exists */}
                                    {p?.transaction_id && (
                                        <Info
                                            label="Transaction ID"
                                            value={p.transaction_id}
                                        />
                                    )}

                                    <Info
                                        label="Status"
                                        value={
                                            <span className={`font-semibold capitalize ${statusColors[p?.status]}`}>
                                                {p?.status || "--"}
                                            </span>
                                        }
                                    />

                                    {p?.note && (
                                        <Info label="Note" value={p.note} />
                                    )}

                                    {p?.rejection_reason && (
                                        <Info
                                            label="Rejection Reason"
                                            value={p.rejection_reason}
                                        />
                                    )}

                                    <Info
                                        label="Received At"
                                        value={p?.received_at || "--"}
                                    />

                                    {/* Mechanic */}
                                    {p?.mechanic && (
                                        <>
                                            <div className="border-t my-2 dark:border-gray-700"></div>

                                            <Info
                                                label="Mechanic"
                                                value={p.mechanic?.name}
                                            />

                                            <Info
                                                label="Phone"
                                                value={p.mechanic?.phone}
                                            />

                                            <Info
                                                label="Email"
                                                value={p.mechanic?.email}
                                            />
                                        </>
                                    )}

                                    {/* Invoice */}
                                    <div
                                        className="flex justify-between items-center pt-2"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Invoice:
                                        </span>

                                        {p?.invoice_url ? (
                                            <LinkPdfDownloadButton
                                                url={p.invoice_url}
                                                label="Download Invoice"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">
                                                Not Available
                                            </span>
                                        )}
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

/* Helper */
const Info = ({ label, value }) => (
    <div className="flex justify-between gap-4">
        <span className="text-gray-600 dark:text-gray-400">{label}:</span>
        <span className="text-right font-medium break-all">
            {value || "--"}
        </span>
    </div>
);
