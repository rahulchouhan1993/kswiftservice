import { useRef, useState, useEffect } from "react";
import { FaCamera, FaTrash } from "react-icons/fa";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useAlerts } from "./Alerts";

export default function MultipleFileInputWithPreview({
    id,
    label,
    name,
    accept = "image/*",
    required = false,
    className = "",
    setData,
    error,
    maxSizeMB = 5,
    maxFiles = 5,
    defaultImages = [],
    width = "w-24",
    height = "h-24",
    rounded = "rounded-md",
}) {
    const inputRef = useRef(null);

    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const { successAlert, errorAlert, errorsHandling } = useAlerts();

    useEffect(() => {
        if (defaultImages?.length) {
            setExistingImages(defaultImages);
        }
    }, [defaultImages]);

    useEffect(() => {
        setData(name, {
            new: newFiles.map((f) => f.file),
            delete: deletedImages.map((img) => img.uuid),
        });
    }, [newFiles, deletedImages, setData, name]);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (files.length + existingImages.length + newFiles.length > maxFiles) {
            errorAlert(`You can only upload up to ${maxFiles} files.`);
            e.target.value = "";
            return;
        }

        const validFiles = [];

        files.forEach((file) => {
            if (file.size > maxSizeMB * 1024 * 1024) {
                errorAlert(`${file.name} exceeds ${maxSizeMB}MB`);
                return;
            }

            if (file.type.startsWith("image/")) {
                validFiles.push({
                    file,
                    preview: URL.createObjectURL(file),
                });
            }
        });

        setNewFiles((prev) => [...prev, ...validFiles]);
    };

    const handleRemoveExisting = async (index) => {
        const img = existingImages[index];

        try {
            const res = await axios.get(route("superadmin.inventory.product.delete.image", img.uuid));
            setExistingImages((prev) => prev.filter((_, i) => i !== index));

            if (res.data?.message) {
                successAlert(res.data.message);
            }
        } catch (error) {
            errorAlert("Failed to delete image. Please try again.");
        }
    };


    const handleRemoveNew = (index) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full">
            {label && <InputLabel htmlFor={id || name} value={label} />}

            <div className="flex flex-wrap gap-3">
                {existingImages.map((img, index) => (
                    <div
                        key={img.uuid || index}
                        className={`relative overflow-hidden group ${width} ${height} ${rounded} ${className}`}
                    >
                        <img
                            src={img.url}
                            alt={`existing-${index}`}
                            className="w-full h-full object-cover border"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveExisting(index)}
                            className="absolute top-1 right-1 bg-black bg-opacity-60 p-1 rounded-full text-white hover:bg-opacity-90"
                            title="Remove image"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                ))}

                {newFiles.map((fileObj, index) => (
                    <div
                        key={`new-${index}`}
                        className={`relative overflow-hidden group ${width} ${height} ${rounded} ${className}`}
                    >
                        <img
                            src={fileObj.preview}
                            alt={`new-${index}`}
                            className="w-full h-full object-cover border"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveNew(index)}
                            className="absolute top-1 right-1 bg-black bg-opacity-60 p-1 rounded-full text-white hover:bg-opacity-90"
                            title="Remove image"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                ))}

                {existingImages.length + newFiles.length < maxFiles && (
                    <div
                        className={`relative flex items-center justify-center overflow-hidden group cursor-pointer border border-dashed border-gray-400 ${width} ${height} ${rounded} ${className}`}
                        onClick={handleClick}
                    >
                        <FaCamera className="text-gray-500 text-lg" />
                        <input
                            id={id || name}
                            ref={inputRef}
                            type="file"
                            name={name}
                            accept={accept}
                            multiple
                            onChange={handleChange}
                            required={required && existingImages.length + newFiles.length === 0}
                            className="hidden"
                        />
                    </div>
                )}
            </div>

            {error && <InputError className="mt-2" message={error} />}
        </div>
    );
}
