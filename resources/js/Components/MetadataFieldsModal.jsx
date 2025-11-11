import React, { useState, useEffect } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { IoClose } from "react-icons/io5";

const defaultFields = ["Adm No", "Photo No", "School Name"];

export default function MetadataFieldsModal({
    isOpen,
    onClose,
    allFields,
    onConfirm,
    initialSelectedFields = [],
}) {
    const [selectedFields, setSelectedFields] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setSelectedFields([...defaultFields, ...initialSelectedFields.filter(f => !defaultFields.includes(f))]);
        }
    }, [isOpen]);

    const handleToggleField = (field) => {
        if (selectedFields.includes(field)) {
            setSelectedFields(selectedFields.filter(f => f !== field));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedFields);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0a0e25] rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                    <IoClose size={20} />
                </button>
                <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
                    Select Metadata Fields
                </h2>
                <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
                    {allFields.map((field, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                            <input
                                type="checkbox"
                                checked={selectedFields.includes(field)}
                                onChange={() => handleToggleField(field)}
                                disabled={defaultFields.includes(field)}
                            />
                            {field}
                        </label>
                    ))}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
                </div>
            </div>
        </div>
    );
}
