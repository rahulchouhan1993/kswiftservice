import { useEffect, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";
import MultiSelectDropdownCheckBox from "./MultiSelectDropdownCheckBox";
import PrimaryButton from "./PrimaryButton";
import SelectInput from "./SelectInput";
import SecondaryButton from "./SecondaryButton";
import { CgCloseR } from "react-icons/cg";

export default function AdvanceFilters({ isOpen, onClose, filters, setFilters, onApply, onReset }) {
    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "transgender", label: "Transgender" },
    ];

    const filterTypes = [
        { value: "have", label: "Have" },
        { value: "not_have", label: "Not Have" },
    ];

    const advanced_filters = [
        { label: "Registration No", value: "reg_no" },
        { label: "Roll No", value: "roll_no" },
        { label: "UID No", value: "uid_no" },
        { label: "Name", value: "name" },
        { label: "Father Name", value: "father_name" },
        { label: "Mother Name", value: "mother_name" },
        { label: "Father Phone", value: "father_phone" },
        { label: "Mother phone", value: "mother_phone" },
        { label: "Photo", value: "photo" },
        { label: "Date Of Birth", value: "dob" },
        { label: "Class", value: "school_class_id" },
        { label: "Section", value: "school_class_section_id" },
        { label: "House", value: "school_house_id" },
        { label: "Gender", value: "gender" },
        { label: "Blood Group", value: "blood_group" },
        { label: "Address", value: "address" },
        { label: "Pincode", value: "pincode" },
        { label: "PEN Number", value: "pan_no" },
        { label: "Sr. Number", value: "sr_no" },
        { label: "RFID Number", value: "rfid_no" },
    ];

    return (
        <div
            className={`fixed top-[58px] right-0 h-full w-[400px] bg-white dark:bg-[#0a0e25] shadow-lg p-4 flex flex-col gap-4 transform transition-transform duration-300 z-50 border-l border-gray-300 dark:border-blue-950
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Advance Search</h2>
                <button onClick={onClose} className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg">
                    <CgCloseR />
                </button>
            </div>

            <div className="p-1 space-y-6">
                <SelectInput
                    options={genderOptions}
                    value={filters.gender}
                    onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
                    placeholder="Filter by Gender"
                />

                <SelectInput
                    options={filterTypes}
                    value={filters.filterType}
                    onChange={(e) => setFilters((prev) => ({ ...prev, filterType: e.target.value }))}
                    placeholder="Filter Type"
                />

                <MultiSelectDropdownCheckBox
                    options={advanced_filters}
                    selected={filters.advancedFields || []}
                    onChange={(selected) =>
                        setFilters((prev) => ({
                            ...prev,
                            advancedFields: selected,
                        }))
                    }
                    placeholder="Select Fields"
                />
            </div>

            <div className="flex flex-col gap-2 mt-auto">
                <PrimaryButton onClick={onApply}>
                    <FaAnglesRight className="mr-1" /> Apply
                </PrimaryButton>

                <SecondaryButton onClick={onReset}>
                    Reset
                </SecondaryButton>
            </div>
        </div>
    );
}
