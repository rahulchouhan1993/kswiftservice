import React from "react";

export default function RoundBtn({
    children,
    onClick,
    type = "button",
    className = "",
    disabled = false,
}) {
    // ✅ Detect if user passed any bg-* class
    const hasBg = className.split(" ").some(cls => cls.startsWith("bg-"));

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center gap-2
                px-4 py-2 rounded-full
                text-white text-sm font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer

                ${hasBg
                    ? ""
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400"
                }

                ${className}
            `}
        >
            {children}
        </button>
    );
}
