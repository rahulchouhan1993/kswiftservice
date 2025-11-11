import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";

export default function ProductsDynamicInput({ onChange }) {
    const [rows, setRows] = useState([{ name: "", price: "" }]);

    const handleAddRow = () => {
        setRows([...rows, { name: "", price: "" }]);
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
                    className="flex flex-col sm:grid sm:grid-cols-2 gap-3 pr-12 relative"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                        </label>
                        <input
                            type="text"
                            value={row.name}
                            onChange={(e) =>
                                handleInputChange(index, "name", e.target.value)
                            }
                            placeholder="Name"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-[#0a0e37] dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Price
                        </label>
                        <input
                            type="text"
                            value={row.price}
                            onChange={(e) =>
                                handleInputChange(index, "price", e.target.value)
                            }
                            placeholder="Price..."
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-[#0a0e37] dark:text-white"
                        />
                    </div>

                    {/* Action Button */}
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
