import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { FaDownload } from "react-icons/fa";
import { useAlerts } from "./Alerts";

export default function FileInput({
    id,
    label,
    name,
    accept = "*",
    required = false,
    className = "",
    setData,
    error,
    maxSizeMB = 5,
    maxFiles = 1,
    isMultiple = false,
    downloadLink = null,
    downloadLabel = "Download Sample",
}) {
    const { successAlert, errorAlert, errorsHandling } = useAlerts();
    const handleChange = (e) => {
        let files = Array.from(e.target.files);

        if (files.length > maxFiles) {
            errorAlert(`You can upload a maximum of ${maxFiles} file(s).`);
            e.target.value = "";
            return;
        }

        for (let file of files) {
            if (file.size > maxSizeMB * 1024 * 1024) {
                errorAlert(`File "${file.name}" exceeds ${maxSizeMB}MB`);
                e.target.value = "";
                return;
            }
        }

        // ✅ Save single or multiple
        if (isMultiple) {
            setData(name, files);
        } else {
            setData(name, files[0] || null);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="w-full flex items-start sm:items-center sm:justify-between justify-start flex-col sm:flex-row gap-2 sm:gap-0">
                    <InputLabel htmlFor={id || name} value={label} />
                    {downloadLink && (
                        <a
                            href={downloadLink}
                            download
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <FaDownload className="mr-1" />
                            {downloadLabel}
                        </a>
                    )}
                </div>
            )}

            <input
                id={id || name}
                type="file"
                name={name}
                accept={accept}
                onChange={handleChange}
                required={required}
                multiple={isMultiple}
                className="block w-full cursor-pointer border-2 border-dashed border-gray-400 
                   rounded-lg sm:px-2 sm:py-2 px-1 py-1 text-sm 
                   text-gray-700 dark:text-gray-200 
                   bg-white dark:bg-[#0a0e37]
                   file:mr-4 file:py-2 file:px-4 
                   file:rounded-md file:border-0 
                   file:text-sm file:font-semibold 
                   file:bg-gradient-to-tr file:from-blue-500 file:to-purple-500 
                   file:text-white 
                   hover:file:brightness-110 transition duration-200"
            />

            {error && <InputError className="mt-2" message={error} />}
        </div>
    );
}
