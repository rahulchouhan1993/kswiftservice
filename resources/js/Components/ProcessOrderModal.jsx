import Modal from "@/Components/Modal";
import { useState } from "react";
import { useAlerts } from "./Alerts";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import ProcessingLoader from "@/Components/ProcessingLoader";

export default function ProcessOrderModal({ show, onClose, onConfirm }) {
    const [processType, setProcessType] = useState('correction_list');
    const [listType, setListType] = useState("");
    const [processing, setProcessing] = useState(false);
    const { successAlert, errorAlert, errorsHandling } = useAlerts();

    const handleClose = () => {
        setProcessType("");
        setListType("");
        setProcessing(false);
        onClose();
    };

    const handleConfirm = async () => {
        let errorMessage = "";
        if (!processType) errorMessage += "Please select a process type.\n";
        if (!listType) errorMessage += "Please select a list type.";

        if (errorMessage) {
            errorAlert(errorMessage.trim());
            return;
        }

        setProcessing(true);

        await onConfirm(
            { processType, listType },
            () => {
                setProcessing(false);
                handleClose();
            },
            () => {
                setProcessing(false);
            }
        );
    };


    return (
        <Modal show={show} maxWidth={"md"} topCloseButton={true} handleTopClose={handleClose}>
            <div className="px-3 pb-3 dark:bg-gray-800">
                <div className="w-full pr-5 pt-2">
                    <h3 className="text-lg font-semibold leading-[18px] mb-4 text-gray-800 dark:text-white">
                        Process Checklist Or Orders
                    </h3>
                </div>

                {processing ? (
                    <ProcessingLoader message={`Processing ${processType === 'order' ? 'Order' : 'Correction List'}...`} />
                ) : (
                    <>
                        {/* List Type Dropdown */}
                        <div className="mb-4">
                            <label
                                htmlFor="list_type"
                                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
                            >
                                List Type
                            </label>
                            <select
                                id="list_type"
                                value={listType}
                                onChange={(e) => setListType(e.target.value)}
                                className="w-full px-4 py-2 text-sm font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                            >
                                <option value="" className="text-gray-400">- Select List Type -</option>
                                <option value="sle_class_wise"> Selected Data - Class Wise</option>
                                <option value="sle_session_wise"> Selected Data - Section Wise</option>
                                <option value="csc_wise"> Complete School Class Wise</option>
                                <option value="cscs_wise"> Complete School Class Sections Wise</option>
                            </select>
                        </div>


                        {/* Process Type Dropdown */}
                        <div className="mb-4">
                            <label
                                htmlFor="process_type"
                                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
                            >
                                Select Process Type
                            </label>
                            <select
                                id="process_type"
                                value={processType}
                                onChange={(e) => setProcessType(e.target.value)}
                                className="w-full px-4 py-2 text-sm font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
                            >
                                <option value="" className="text-gray-400">- Select Process Type -</option>
                                <option value="correction_list"> Create Correction List</option>
                                {/* <option value="order"> Create Order</option> */}
                            </select>
                        </div>


                        {/* Buttons */}
                        <div className="flex justify-end">
                            <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                            <PrimaryButton className="ml-3" onClick={handleConfirm}>
                                Confirm
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
