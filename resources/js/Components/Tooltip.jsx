import { useState } from "react";

export default function Tooltip({
    children,
    title,
    position = "top",
    classes = "",
    width = "min-w-[100px]",
    height = "h-auto",
}) {
    const [visible, setVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-blue-900",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-blue-900",
        left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-blue-900",
        right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-blue-900",
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}

            <div
                className={`
                    pointer-events-none absolute z-50
                    transition-all duration-200 ease-out
                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
                    ${positionClasses[position]}
                `}
            >
                {/* Tooltip box */}
                <div
                    className={`
                        inline-block
                        ${width}
                        ${height}
                        px-3 py-1.5
                        text-xs font-medium
                        text-white bg-blue-900
                        rounded-lg shadow-lg
                        border border-blue-800
                        backdrop-blur-sm
                        break-words
                        text-center
                        ${classes}
                    `}
                >
                    {title}

                    {/* Arrow */}
                    <span
                        className={`
                            absolute w-0 h-0
                            border-4
                            ${arrowClasses[position]}
                        `}
                    />
                </div>
            </div>
        </div>
    );
}
