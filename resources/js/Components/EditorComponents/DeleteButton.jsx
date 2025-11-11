import { MdDeleteForever } from "react-icons/md";

export default function DeleteButton({ deleteSelected }) {
  return (
    <div className="">
      <button
        className="flex items-center gap-1 px-1 py-1 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-all"
        onClick={deleteSelected}
      >
        <MdDeleteForever size={28} /> 
      </button>
    </div>
  );
}