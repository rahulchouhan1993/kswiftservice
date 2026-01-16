import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiDotsVertical } from "react-icons/hi";

export default function RowActionsMenu({ children }) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 6,
                left: rect.right + window.scrollX - 170, // SMALL WIDTH
            });
        }
    }, [open]);

    useEffect(() => {
        const handler = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <>
            {/* Trigger */}
            <button
                ref={buttonRef}
                onClick={() => setOpen((v) => !v)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition"
            >
                <HiDotsVertical className="text-base text-gray-700 dark:text-gray-300" />
            </button>

            {/* Dropdown */}
            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            position: "absolute",
                            top: position.top,
                            left: position.left,
                            zIndex: 9999,
                        }}
                        className="
                            w-40 rounded-xl
                            backdrop-blur-xl
                            bg-white/80 dark:bg-[#0b0f2f]/85
                            border border-white/30 dark:border-white/10
                            shadow-lg
                            animate-dropdown
                        "
                    >
                        <div className="p-1 flex flex-col">
                            {children}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
