import { RiImageEditFill } from 'react-icons/ri';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ImageUploader({
    imageUrl,
    uploadRoute,
    param = {},
    name = "image",
    label = "Upload Image",
    width = "w-72",
    height = "h-72",
    borderColor = "border-gray-300 dark:border-blue-900",
}) {
    const [preview, setPreview] = useState(imageUrl);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append(name, file);

        router.post(route(uploadRoute, param), formData, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <div className="relative group">
            <label htmlFor={`${name}-upload`} className={`cursor-pointer relative inline-block ${width} ${height}`}>
                <img
                    src={preview}
                    alt={label}
                    className={`${width} ${height} rounded-xl object-cover shadow-md border-4 ${borderColor} transition-transform duration-300 group-hover:scale-105`}
                />
                <div className="absolute inset-0 flex items-start justify-end p-1">
                    <span className="text-white bg-black bg-opacity-60 rounded-full p-1">
                        <RiImageEditFill className="w-5 h-5" />
                    </span>
                </div>
            </label>

            <input
                id={`${name}-upload`}
                name={name}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />
        </div>
    );
}
