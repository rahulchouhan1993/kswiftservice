import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import TextInput from "./TextInput";
import InputLabel from "./InputLabel";
import PhoneInput from "./PhoneInput";

export default function MultipleContactInputs({ onChange }) {
    const [rows, setRows] = useState([{ name: "", phone: "" }]);

    const handleAddRow = () => {
        setRows([...rows, { name: "", phone: "" }]);
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        onChange && onChange(updatedRows);
    };

    const handleInputChange = (index, field, newValue) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = newValue;
        setRows(updatedRows);
        onChange && onChange(updatedRows);
    };

    return (
        <div className="space-y-4">
            {rows.map((row, index) => (
                <div
                    key={index}
                    className="flex flex-col sm:grid sm:grid-cols-3 gap-3 pr-12 relative"
                >

                    <div>
                        <InputLabel htmlFor={`relation_${index}`} value="Relation" />
                        <select
                            value={row.relation}
                            onChange={(e) =>
                                handleInputChange(index, "relation", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-500 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e37]"
                        >
                            <option value="">- Select Relation -</option>
                            <option value="Self">Self</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Brother">Brother</option>
                            <option value="Sister">Sister</option>
                            <option value="Cousin">Cousin</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <InputLabel htmlFor="Name" value="Name" />
                        <TextInput
                            type="text"
                            value={row.name}
                            onChange={(e) =>
                                handleInputChange(index, "name", e.target.value)
                            }
                            placeholder="Name"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Phone" />
                        <PhoneInput
                            value={row.phone}
                            onChange={(e) =>
                                handleInputChange(index, "phone", e.target.value)
                            }
                            placeholder="Phone"
                        />
                    </div>

                    {index === 0 ? (
                        <button
                            type="button"
                            onClick={handleAddRow}
                            className="px-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md absolute sm:top-1/4 top-auto bottom-0 sm:bottom-auto mt-2 right-0"
                        >
                            <IoMdAddCircle className="text-2xl" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleDeleteRow(index)}
                            className="px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md absolute sm:top-1/4 top-auto bottom-0 sm:bottom-auto mt-2 right-0"
                        >
                            <AiFillDelete className="text-2xl" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
