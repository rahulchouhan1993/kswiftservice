import { CiText } from "react-icons/ci";
import PrimaryButton from "../PrimaryButton";
import { MdFileUpload } from "react-icons/md";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { FaThList } from "react-icons/fa";

export default function AddText({ addElement }) {
    return (
        <div className="flex flex-col gap-2 p-1">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <MdFileUpload />Upload Your Files
            </h3>
            <PrimaryButton
                onClick={() => addElement("text")}
                className="w-full"
            >
                <CiText size={18} className="drop-shadow-sm" /> Add Text
            </PrimaryButton>

            <div className="flex flex-col mt-4 text-gray-700 dark:text-gray-200 gap-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <FaThList />Create Lists
            </h3>
                <div className="flex items-center text-md justify-between">
                    <p 
                        onClick={() => addElement("orderedList")}
                        className="px-2 py-1.5 flex items-center gap-2 border border-gray-600 dark:border-blue-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-blue-700"
                    >
                        <AiOutlineOrderedList className="text-2xl" /> Ordered List
                    </p>
                    <p 
                        onClick={() => addElement("unorderedList")}
                        className="px-2 py-1.5 flex items-center gap-2 border border-gray-600 dark:border-blue-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-blue-700"
                    >
                        <AiOutlineUnorderedList className="text-2xl" />UnOrdered List
                    </p>
                </div>
            </div>
        </div>
    );
}