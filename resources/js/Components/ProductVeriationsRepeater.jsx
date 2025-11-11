import React, { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import PriceInput from "./PriceInput";
import DiscountPercentage from "./DiscountPercentage";
import TextInputWithDropDown from "./TextInputWithDropDown";
import SelectInput from "./SelectInput";
import { FaFileImage, FaHashtag } from "react-icons/fa6";
import TipTapTextEditor from "./TipTapTextEditor";
import FileInputWithPreview from "./FileInputWithPreview";
import MultipleFileInputWithPreview from "./MultipleFileInputWithPreview";

export default function ProductVeriationsRepeater({ value = [], onChange }) {
    const emptyRow = {
        variationTypes: [],
        variations: {
            thickness_unit: "mm",
            width_unit: "mm",
            height_unit: "mm",
            length_unit: "mm",
        },
        price: "",
        customer_price: "",
        dealer_price: "",
        quantity: "",
        description: "",
    };

    const [rows, setRows] = useState(value.length ? value : [emptyRow]);

    useEffect(() => {
        if (value.length) setRows(value);
    }, [value]);

    const handleAddRow = () => {
        const updated = [...rows, { ...emptyRow }];
        setRows(updated);
        onChange?.(updated);
    };

    const handleDeleteRow = (index) => {
        const updated = rows.filter((_, i) => i !== index);
        setRows(updated.length ? updated : [emptyRow]);
        onChange?.(updated);
    };

    const handleInputChange = (index, field, newValue, isVariation = false) => {
        const updated = [...rows];
        if (isVariation) updated[index].variations[field] = newValue;
        else updated[index][field] = newValue;
        setRows(updated);
        onChange?.(updated);
    };

    const handleVariationSelection = (index, selected) => {
        const updated = [...rows];
        updated[index].variationTypes = selected;

        const fields = variationFieldMap[selected[0]] || [];
        fields.forEach((field) => {
            if (["thickness", "width", "height", "length"].includes(field)) {
                if (!updated[index].variations[`${field}_unit`]) {
                    updated[index].variations[`${field}_unit`] = "mm";
                }
            }
        });

        setRows(updated);
        onChange?.(updated);
    };


    const handleDropdownChange = (index, field, value) => {
        const updated = [...rows];
        updated[index].variations[`${field}_unit`] = value;
        setRows(updated);
        onChange?.(updated);
    };


    const variationOptions = [
        { value: "thick_size_color", label: "Thickness + Size + Color" },
        { value: "thick_wh_color", label: "Thickness + (Width + Height) + Color" },
        { value: "width_height", label: "Width + Height" },
        { value: "thickness_width_height", label: "Thickness + Width + Height" },
        { value: "width_length", label: "Width + Length" },
        { value: "height_width_length", label: "Height + Width + Length" },
        { value: "type_thick_size_color", label: "Type + Thickness + Size + Color" },
        { value: "type_thick_wh_color", label: "Type + Thickness + (Width + Height) + Color" },
    ];

    const variationFieldMap = {
        thick_size_color: ["thickness", "size", "color"],
        thick_wh_color: ["thickness", "width", "height", "color"],
        width_height: ["width", "height"],
        thickness_width_height: ["thickness", "width", "height"],
        width_length: ["width", "length"],
        height_width_length: ["height", "width", "length"],
        type_thick_size_color: ["type", "thickness", "size", "color"],
        type_thick_wh_color: ["type", "thickness", "width", "height", "color"],
    };

    // ✅ Predefined size options for "size" dropdown
    const sizeOptions = [
        { value: "A4", label: "A4" },
        { value: "A3", label: "A3" },
        { value: "13x19", label: "13 x 19" },
        { value: "12x18", label: "12 x 18" },
        { value: "8x10", label: "8 x 10" },
    ];

    return (
        <div className="space-y-6">
            {rows.map((row, index) => (
                <div
                    key={index}
                    className="relative border border-gray-200 p-6 rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                    {/* Header Row */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-auto">
                            <InputLabel value="Variation Type" />
                            <SelectInput
                                id={`variationType-${index}`}
                                options={variationOptions}
                                value={row.variationTypes[0] || ""}
                                onChange={(e) => handleVariationSelection(index, [e.target.value])}
                                placeholder="- Select Variation Type -"
                            />
                        </div>

                        <div className="flex gap-2">
                            {index === 0 ? (
                                <button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm"
                                >
                                    <IoMdAddCircle className="text-xl" /> Add
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteRow(index)}
                                    className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
                                >
                                    <AiFillDelete className="text-xl" /> Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Variation Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {row.variationTypes.flatMap((variationKey) => {
                            const fields = variationFieldMap[variationKey] || [];
                            return fields.map((field) => {
                                const label = field.charAt(0).toUpperCase() + field.slice(1);

                                // ✅ Special handling for "thick_size_color"
                                if (variationKey === "thick_size_color") {
                                    if (field === "thickness") {
                                        return (
                                            <div key={`${variationKey}-${field}`} className="col-span-1">
                                                <InputLabel value="Thickness *" />
                                                <TextInputWithDropDown
                                                    type="text"
                                                    placeholder="Enter Thickness"
                                                    value={row.variations[field] || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(index, field, e.target.value, true)
                                                    }
                                                    dropdownOptions={[
                                                        { value: "mm", label: "mm" },
                                                        { value: "cm", label: "cm" },
                                                        { value: "mic", label: "mic" },
                                                        { value: "inch", label: "inch" },
                                                    ]}
                                                    dropdownValue={row.dropdownValues[field] || "mm"}
                                                    onDropdownChange={(e) => handleDropdownChange(index, field, e.target.value)}
                                                />
                                            </div>
                                        );
                                    } else if (field === "size") {
                                        return (
                                            <div key={`${variationKey}-${field}`} className="col-span-1">
                                                <InputLabel value="Size *" />
                                                <SelectInput
                                                    id={`size-${index}`}
                                                    options={sizeOptions}
                                                    value={row.variations.size || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(index, "size", e.target.value, true)
                                                    }
                                                    placeholder="- Select Size -"
                                                />
                                            </div>
                                        );
                                    } else if (field === "color") {
                                        return (
                                            <div key={`${variationKey}-${field}`} className="col-span-1">
                                                <InputLabel value="Color *" />
                                                <TextInput
                                                    name={`product_veriations[${index}][color]`}
                                                    value={row.variations.color || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(index, "color", e.target.value, true)
                                                    }
                                                    placeholder="Enter Color"
                                                    required
                                                />
                                            </div>
                                        );
                                    }
                                }

                                // ✅ Default handling for all other variation types
                                const hasDropdown = ["thickness", "width", "height", "length"].includes(field);

                                return (
                                    <div key={`${variationKey}-${field}`} className="col-span-1">
                                        <InputLabel value={`${label} *`} />
                                        {hasDropdown ? (
                                            <TextInputWithDropDown
                                                type="text"
                                                placeholder="Enter Thickness"
                                                value={row.variations[field] || ""}
                                                onChange={(e) => handleInputChange(index, field, e.target.value, true)}
                                                dropdownOptions={[
                                                    { value: "mm", label: "mm" },
                                                    { value: "cm", label: "cm" },
                                                    { value: "mic", label: "mic" },
                                                    { value: "inch", label: "inch" },
                                                ]}
                                                dropdownValue={row.variations[`${field}_unit`] || "mm"}
                                                onDropdownChange={(e) => handleDropdownChange(index, field, e.target.value)}
                                                name={`product_veriations[${index}][variations][${field}_unit]`}
                                            />

                                        ) : (
                                            <TextInput
                                                name={`product_veriations[${index}][${field}]`}
                                                value={row.variations[field] || ""}
                                                onChange={(e) =>
                                                    handleInputChange(index, field, e.target.value, true)
                                                }
                                                placeholder={`Enter ${label}`}
                                                required
                                            />
                                        )}
                                    </div>
                                );
                            });
                        })}

                        {/* Price Fields */}
                        <div>
                            <InputLabel value="Price (MRP) *" />
                            <PriceInput
                                name={`product_veriations[${index}][price]`}
                                value={row.price}
                                onChange={(e) =>
                                    handleInputChange(index, "price", e.target.value)
                                }
                                placeholder="Enter MRP"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center">
                                <InputLabel value="Customer Price (₹)" />
                                <DiscountPercentage
                                    originalPrice={row.price}
                                    currentPrice={row.customer_price}
                                />
                            </div>
                            <PriceInput
                                name={`product_veriations[${index}][customer_price]`}
                                value={row.customer_price}
                                onChange={(e) =>
                                    handleInputChange(index, "customer_price", e.target.value)
                                }
                                placeholder="Enter Customer Price"
                                disabled={!row.price}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center">
                                <InputLabel value="Dealer Price (₹)" />
                                <DiscountPercentage
                                    originalPrice={row.price}
                                    currentPrice={row.dealer_price}
                                />
                            </div>
                            <TextInput
                                name={`product_veriations[${index}][dealer_price]`}
                                value={row.dealer_price}
                                onChange={(e) =>
                                    handleInputChange(index, "dealer_price", e.target.value)
                                }
                                placeholder="Enter Dealer Price"
                                disabled={!row.price}
                            />
                        </div>

                        <div>
                            <InputLabel value="Stock (Qty)" />
                            <TextInput
                                name={`product_veriations[${index}][quantity]`}
                                value={row.quantity}
                                onChange={(e) =>
                                    handleInputChange(index, "quantity", e.target.value)
                                }
                                placeholder="Enter Quantity"
                            />
                        </div>
                    </div>

                    <div className="my-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <FaHashtag className="text-purple-500" /> Long Description
                            </h2>
                            <TipTapTextEditor
                                name={`product_veriations[${index}][description]`}
                                content={row.description}
                                handleContentUpdate={(c) => setRows("description", c)}
                            />
                        </div>

                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <FaFileImage className="text-red-500" /> Photos
                            </h2>
                            <div className="grid md:grid-cols-4 gap-4 mt-2">
                                <FileInputWithPreview
                                    name={`product_veriations[${index}][thumbnail_photo]`}
                                    label="Thumbnail Photo"
                                    setData={(name, file) => handleInputChange(index, "thumbnail_photo", file)}
                                    accept="image/*"
                                    width="w-24"
                                    height="h-24"
                                    rounded="rounded-md"
                                />

                                <FileInputWithPreview
                                    name={`product_veriations[${index}][thumbnail_video]`}
                                    label="Thumbnail Video"
                                    accept="video/*"
                                    setData={(name, file) => handleInputChange(index, "thumbnail_video", file)}
                                    width="w-24"
                                    height="h-24"
                                    rounded="rounded-md"
                                />

                                <FileInputWithPreview
                                    name={`product_veriations[${index}][product_360video]`}
                                    label="Product 360 Video"
                                    setData={(name, file) => handleInputChange(index, "product_360video", file)}
                                    accept="video/*"
                                    width="w-24"
                                    height="h-24"
                                    rounded="rounded-md"
                                />

                                <FileInputWithPreview
                                    name={`product_veriations[${index}][product_pdf]`}
                                    label="Product Pdf"
                                    setData={(name, file) => handleInputChange(index, "product_pdf", file)}
                                    accept="application/pdf"
                                    width="w-24"
                                    height="h-24"
                                    rounded="rounded-md"
                                />
                            </div>

                            <div className="my-3">
                                <MultipleFileInputWithPreview
                                    name={`product_veriations[${index}][product_images]`}
                                    label="Product Images"
                                    setData={(name, files) => handleInputChange(index, "product_images", files)}
                                    maxFiles={6}
                                    maxSizeMB={10}
                                    width="w-32"
                                    height="h-32"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
