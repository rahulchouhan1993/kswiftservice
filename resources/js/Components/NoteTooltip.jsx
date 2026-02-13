import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function NoteTooltip({
    note,
    Icon = InformationCircleIcon, // default icon
    iconClass = "",
    tooltipClass = "",
    wrapperClass = "",
}) {
    if (!note) return null;

    return (
        <div className={`relative flex items-center group ${wrapperClass}`}>
            
            {/* Icon */}
            <Icon
                className={`
                    w-5 h-5
                    text-blue-500
                    cursor-pointer
                    transition
                    duration-200
                    group-hover:text-blue-600
                    ${iconClass}
                `}
            />

            {/* Tooltip */}
            <div
                className={`
                    pointer-events-none
                    absolute
                    left-1/2
                    -translate-x-1/2
                    bottom-full
                    mb-3
                    opacity-0
                    scale-95
                    group-hover:opacity-100
                    group-hover:scale-100
                    transition-all
                    duration-200
                    z-50
                `}
            >
                <div
                    className={`
                        bg-gray-900
                        text-white
                        text-sm
                        rounded-lg
                        shadow-xl
                        px-4
                        py-3
                        w-64
                        text-left
                        leading-relaxed
                        break-words
                        ${tooltipClass}
                    `}
                >
                    {note}
                </div>

                {/* Arrow */}
                <div className="
                    w-3 h-3
                    bg-gray-900
                    rotate-45
                    absolute
                    left-1/2
                    -translate-x-1/2
                    -bottom-1
                " />
            </div>
        </div>
    );
}
