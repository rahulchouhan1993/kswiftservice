import React from "react";

export default function RoundBtn({
    children,
    onClick,
    type = "button",
    className = "",
    disabled = false,
}) {
    const hasBg = className.split(" ").some(cls => cls.startsWith("bg-"));
    const hasSize = className.split(" ").some(
        cls => cls.startsWith("h-") || cls.startsWith("w-")
    );

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center
                rounded-full
                text-white text-sm font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer

                ${hasSize ? "" : "px-4 py-2"}

                ${hasBg
                    ? ""
                    : "bg-[#101f3b] hover:bg-[#17305c] focus:ring-[#101f3b]"
                }

                ${className}
            `}
        >
            {children}
        </button>
    );
}
