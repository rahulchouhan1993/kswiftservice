import { useRef, useState, useEffect } from "react";
import { FaCamera, FaTrash, FaFilePdf } from "react-icons/fa";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function FileInputWithPreview({
    id,
    label,
    name,
    accept = "image/*,video/*,application/pdf",
    required = false,
    className = "",
    setData,
    error,
    maxSizeMB = 20,
    defaultFile = null,
    defaultImage = null,
    width = "w-40",
    height = "h-40",
    rounded = "rounded-md",
}) {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(defaultFile || defaultImage); 
    const [fileType, setFileType] = useState(null);

     useEffect(() => {
        const fileUrl = defaultFile || defaultImage;
        if (fileUrl) {
            setPreviewUrl(fileUrl);

            if (/\.(mp4|mov|avi|webm)$/i.test(fileUrl)) {
                setFileType("video");
            } else if (/\.pdf$/i.test(fileUrl)) {
                setFileType("pdf");
            } else {
                setFileType("image");
            }
        } else {
            setPreviewUrl(null);
            setFileType(null);
        }
    }, [defaultFile, defaultImage]);



    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`File size exceeds ${maxSizeMB}MB`);
            e.target.value = "";
            return;
        }

        let type = "other";
        if (file.type.startsWith("video/")) type = "video";
        else if (file.type.startsWith("image/")) type = "image";
        else if (file.type === "application/pdf") type = "pdf";

        setFileType(type);

        if (type === "video") {
            const videoUrl = URL.createObjectURL(file);
            setPreviewUrl(videoUrl);
        } else if (type === "image") {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else if (type === "pdf") {
            // Just show pdf icon
            setPreviewUrl("pdf");
        }

        setData(name, file);
    };

    const handleReset = () => {
        setPreviewUrl(null);
        setFileType(null);
        setData(name, null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="w-full ">
            {label && <InputLabel htmlFor={id || name} value={label} />}

            <div
                className={`relative overflow-hidden group cursor-pointer ${width} ${height} ${rounded} ${className}`}
                onClick={handleClick}
            >
                {previewUrl ? (
                    fileType === "video" ? (
                        <video
                            src={previewUrl}
                            className="w-full h-full object-cover border"
                            controls
                        />
                    ) : fileType === "image" ? (
                        <img
                            src={previewUrl}
                            alt="preview"
                            className="w-full h-full object-cover border"
                        />
                    ) : fileType === "pdf" ? (
                        <div className="flex items-center justify-center w-full h-full border bg-gray-100">
                            <FaFilePdf className="text-red-600 text-5xl" />
                        </div>
                    ) : null
                ) : (
                    <img
                        src="https://via.placeholder.com/150x150.png?text=Upload"
                        alt="placeholder"
                        className="w-full h-full object-cover border opacity-50 grayscale"
                    />
                )}

                {/* Overlay with camera icon */}
                <div
                    className={`absolute inset-0 flex items-center justify-center transition ${
                        previewUrl
                            ? "bg-black bg-opacity-30 opacity-0 group-hover:opacity-100"
                            : "bg-gray-800 bg-opacity-30 opacity-100"
                    }`}
                >
                    <FaCamera className="text-white text-lg" />
                </div>

                {/* Remove button */}
                {previewUrl && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                        }}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 p-1 rounded-full text-white hover:bg-opacity-90"
                        title="Remove file"
                    >
                        <FaTrash size={12} />
                    </button>
                )}

                <input
                    id={id || name}
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={handleChange}
                    required={required}
                    className="hidden"
                />
            </div>

            {error && <InputError className="mt-2" message={error} />}
        </div>
    );
}
