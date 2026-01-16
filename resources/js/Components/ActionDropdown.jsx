import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function ActionDropdown({
    label = "Actions",
    items = [],
    separatedItems = [],
    buttonClass = "",
    menuClass = "",
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderItem = (item, index) => {
        const {
            label,
            icon: Icon,
            href,
            onClick,
            className = "",
            disabled = false,
        } = item;

        const baseClass =
            "inline-flex items-center gap-2 w-full p-2 rounded transition";

        const disabledClass = disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-neutral-tertiary-medium hover:text-heading";

        if (href) {
            return (
                <a
                    key={index}
                    href={href}
                    className={`${baseClass} ${disabledClass} ${className}`}
                >
                    {Icon && <Icon size={14} />}
                    {label}
                </a>
            );
        }

        return (
            <button
                key={index}
                type="button"
                disabled={disabled}
                onClick={() => {
                    onClick?.();
                    setOpen(false);
                }}
                className={`${baseClass} text-left ${disabledClass} ${className}`}
            >
                {Icon && <Icon size={14} />}
                {label}
            </button>
        );
    };

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            {/* Button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`inline-flex items-center justify-center
                    bg-brand text-white
                    hover:bg-brand-strong
                    focus:ring-4 focus:ring-brand-medium
                    shadow-xs rounded-base text-sm
                    px-4 py-2.5
                    ${buttonClass}`}
            >
                {label}
                <FiChevronDown className="w-4 h-4 ms-1.5" />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className={`absolute right-0 mt-2 z-50 w-44
                        bg-neutral-primary-medium
                        border border-default-medium
                        rounded-base shadow-lg
                        ${menuClass}`}
                >
                    <ul className="p-2 text-sm text-body font-medium">
                        {items.map(renderItem)}
                    </ul>

                    {separatedItems.length > 0 && (
                        <div className="border-t border-default-medium p-2 text-sm text-body font-medium">
                            {separatedItems.map(renderItem)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
