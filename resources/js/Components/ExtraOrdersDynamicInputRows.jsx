import React, { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";

export default function ExtraOrdersDynamicInputRows({ value = [], onChange }) {
    const [rows, setRows] = useState(value.length ? value : [{ name: "", value: "" }]);

    useEffect(() => {
        if (value.length) {
            setRows(value);
        }
    }, [value]);

    const handleAddRow = () => {
        const updated = [...rows, { name: "", value: "" }];
        setRows(updated);
        onChange && onChange(updated);
    };

    const handleDeleteRow = (index) => {
        const updated = rows.filter((_, i) => i !== index);
        setRows(updated.length ? updated : [{ name: "", value: "" }]);
        onChange && onChange(updated);
    };

    const handleInputChange = (index, field, newValue) => {
        const updated = [...rows];
        updated[index][field] = newValue;
        setRows(updated);
        onChange && onChange(updated);
    };

    return (
        <div className="space-y-4">
            {rows.map((row, index) => (
                <div
                    key={index}
                    className="flex flex-col sm:grid sm:grid-cols-2 gap-3 pr-12 relative"
                >
                    <div>
                        <InputLabel value="Name *" />
                        <TextInput
                            name={`extra_details[${index}][name]`}
                            value={row.name}
                            onChange={(e) =>
                                handleInputChange(index, "name", e.target.value)
                            }
                            placeholder="Name"
                            required
                        />
                    </div>

                    <div>
                        <InputLabel value="Value *" />
                        <TextInput
                            name={`extra_details[${index}][value]`}
                            value={row.value}
                            onChange={(e) =>
                                handleInputChange(index, "value", e.target.value)
                            }
                            placeholder="Value"
                            required
                        />
                    </div>

                    {index === 0 ? (
                        <button
                            type="button"
                            onClick={handleAddRow}
                            className="px-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md absolute sm:top-1/4 bottom-0 sm:bottom-auto mt-2 right-0"
                        >
                            <IoMdAddCircle className="text-2xl" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleDeleteRow(index)}
                            className="px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md absolute sm:top-1/4 bottom-0 sm:bottom-auto mt-2 right-0"
                        >
                            <AiFillDelete className="text-2xl" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
