import Modal from "@/Components/Modal";
import { useState } from "react";
import { useAlerts } from "./Alerts";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function UpdateOrderStatusModal({ show, auth, onClose, onConfirm }) {
    const [status, setStatus] = useState("");
    const [issueNote, setIssueNote] = useState("");
    const { successAlert, errorAlert, errorsHandling } = useAlerts();

    const handleClose = () => {
        setStatus("");
        setIssueNote("");
        onClose();
    };

    // console.log('auth', auth);


    const handleConfirm = () => {
        if (!status) return errorAlert("Please select a status");

        if (status === "printing_issue" && !issueNote.trim()) {
            return errorAlert("Please provide details for the printing issue.");
        }

        onConfirm({ status, issueNote });
        handleClose();
    };

    return (
        <Modal show={show} maxWidth={"md"} topCloseButton={true} handleTopClose={onClose}>
            <div className="p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Change Order Status</h3>

                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Select new status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                        <option value="">-- Select Status --</option>
                        {auth?.role === "developer" ? (
                            <>
                                <option value="work_in_process">Work In Process</option>
                                <option value="printing_done">Printing Done</option>
                                <option value="verified">Verified</option>
                                <option value="delivered">Delivered</option>
                            </>
                        ) : (
                            <>
                                <option value="delivery_verified">Delivery Verified</option>
                                <option value="printing_issue">Printing Issue</option>
                            </>
                        )}
                    </select>
                </div>

                {status === "printing_issue" && (
                    <div className="mb-4">
                        <label htmlFor="issueNote" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Describe the issue
                        </label>
                        <textarea
                            id="issueNote"
                            rows={4}
                            value={issueNote}
                            onChange={(e) => setIssueNote(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="Please provide details about the printing issue..."
                        ></textarea>
                    </div>
                )}

                <div className="flex justify-end">
                    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ml-3" onClick={handleConfirm}>
                        Confirm
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
