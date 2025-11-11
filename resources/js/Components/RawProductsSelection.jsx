import { useState, useEffect } from "react";
import axios from "axios";
import { IoIosAdd, IoMdClose } from "react-icons/io";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import SearchableDropdown from "@/Components/SearchableDropdown";
import DigitsInput from "./DigitsInput";

export default function RawProductsSelection({ data, setData, errors }) {
    const [rows, setRows] = useState([{ id: Date.now() }]);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(route("common.get.products"));
            const mapped = response.data.map((p) => ({
                value: p.id,
                label: p.name,
            }));
            setProducts(mapped);
        } catch (err) {
            console.error("❌ Failed to fetch products:", err);
        }
    };

    // Fetch products when component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    const addRow = () => setRows([...rows, { id: Date.now() }]);
    const removeRow = (id) => {
        const updated = rows.filter((row) => row.id !== id);
        setRows(updated.length > 0 ? updated : [{ id: Date.now() }]);
        setData(
            "raw_materials",
            data.raw_materials?.filter((rm) => rm.id !== id) || []
        );
    };

    const handleRowChange = (id, field, value) => {
        let updated = data.raw_materials || [];
        const index = updated.findIndex((rm) => rm.id === id);

        if (index > -1) {
            updated[index] = { ...updated[index], [field]: value };
        } else {
            updated.push({ id, [field]: value });
        }

        setData("raw_materials", updated);
    };

    return (
        <div className="p-2 border mt-3 rounded-md">
            <h1 className="font-semibold">Raw Materials</h1>

            {rows.map((row, index) => (
                <div
                    key={row.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 relative"
                >
                    <button
                        type="button"
                        onClick={() =>
                            index === rows.length - 1 ? addRow() : removeRow(row.id)
                        }
                        className={`absolute right-2 top-[38px] p-1 rounded-lg ${
                            index === rows.length - 1 ? "bg-green-500" : "bg-red-500"
                        } text-white`}
                    >
                        {index === rows.length - 1 ? (
                            <IoIosAdd className="text-xl" />
                        ) : (
                            <IoMdClose className="text-xl" />
                        )}
                    </button>

                    <div className="grid md:grid-cols-6 gap-3 pr-10">
                        {/* Product Dropdown */}
                        <div className="md:col-span-2">
                            <SearchableDropdown
                                label="Product"
                                options={products}
                                onSelect={(val) =>
                                    handleRowChange(row.id, "product_id", val?.value)
                                }
                                menuClassName="max-h-60 overflow-y-scroll"
                                inputClassName="text-sm px-2"
                                value={
                                    products.find(
                                        (p) =>
                                            p.value ===
                                            data.raw_materials?.find(
                                                (rm) => rm.id === row.id
                                            )?.product_id
                                    ) || null
                                }
                            />
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-1">
                            <InputLabel value="Quantity" className="mb-1" />
                            <DigitsInput
                                placeholder="Qty"
                                value={
                                    data.raw_materials?.find((rm) => rm.id === row.id)
                                        ?.qty || ""
                                }
                                onChange={(e) =>
                                    handleRowChange(row.id, "qty", e.target.value)
                                }
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-3">
                            <InputLabel value="Description" className="mb-1" />
                            <TextAreaInput
                                rows={1}
                                className="w-full"
                                placeholder="Description"
                                value={
                                    data.raw_materials?.find((rm) => rm.id === row.id)
                                        ?.description || ""
                                }
                                onChange={(e) =>
                                    handleRowChange(row.id, "description", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            ))}

            {errors?.raw_materials && (
                <p className="text-sm text-red-600 mt-2">
                    {errors.raw_materials}
                </p>
            )}
        </div>
    );
}
