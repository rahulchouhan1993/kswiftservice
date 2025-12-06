import { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function RowActionsMenu({ children }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            // ⭐ If modal is open, do NOT close the dropdown
            if (document.body.classList.contains("modal-open")) return;

            // Normal outside click behavior
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
                <FiMoreVertical size={18} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 z-50 w-max">
                    {children}
                </div>
            )}
        </div>
    );
}
