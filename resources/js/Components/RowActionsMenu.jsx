import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiDotsVertical } from "react-icons/hi";

export default function RowActionsMenu({ children }) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Calculate dropdown position
    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 1,
                left: rect.right + window.scrollX - 200, // dropdown width
            });
        }
    }, [open]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Trigger */}
            <button
                ref={buttonRef}
                onClick={() => setOpen((v) => !v)}
                className="p-2 rounded-full
                           hover:bg-gray-200 dark:hover:bg-[#1a1f4a]
                           transition"
            >
                <HiDotsVertical className="text-lg text-gray-700 dark:text-gray-300" />
            </button>

            {/* Dropdown via Portal */}
            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            position: "absolute",
                            top: position.top,
                            left: position.left,
                            zIndex: 1,
                        }}
                        className="w-48 rounded-xl shadow-2xl
                                   bg-white dark:bg-[#0f1435]
                                   border border-gray-200 dark:border-blue-900
                                   animate-fade-in"
                    >
                        <div className="p-2 space-y-1">{children}</div>
                    </div>,
                    document.body
                )}
        </>
    );
}
