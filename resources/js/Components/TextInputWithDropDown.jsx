import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export default forwardRef(function TextInputWithDropDown(
    {
        type = "text",
        className = "",
        isFocused = false,
        dropdownOptions = [],
        dropdownValue,
        onDropdownChange,
        ...props
    },
    ref
) {
    const localRef = useRef(null);
    const measureRef = useRef(null);
    const [dropdownWidth, setDropdownWidth] = useState("auto");

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    // Dynamically calculate width based on longest option text
    useEffect(() => {
        if (!dropdownOptions.length) return;

        const longestLabel = dropdownOptions.reduce((a, b) =>
            a.label.length > b.label.length ? a : b
        ).label;

        // Set the hidden span text for measurement
        if (measureRef.current) {
            measureRef.current.textContent = longestLabel;
            const width = measureRef.current.offsetWidth + 40; // + padding and icon space
            setDropdownWidth(`${width}px`);
        }
    }, [dropdownOptions]);

    return (
        <div className="flex items-center mt-1 relative">
            {/* Hidden element for measuring dropdown width */}
            <span
                ref={measureRef}
                className="absolute invisible whitespace-nowrap px-2 py-2 text-sm font-normal"
            ></span>

            {/* Dropdown on the left */}
            {dropdownOptions.length > 0 && (
                <select
                    {...(props.name ? { name: props.name } : {})}
                    value={dropdownValue}
                    onChange={onDropdownChange}
                    style={{ width: dropdownWidth }}
                    className="border border-gray-500 rounded-l-md ..."
                >
                    {dropdownOptions.map((option, i) => (
                        <option key={i} value={option.value}>{option.label}</option>
                    ))}
                </select>
            )}

            <input
                {...props}
                type={type}
                className={
                    "block w-full border border-gray-500 rounded-r-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e37] px-2 py-2 " +
                    className
                }
                ref={localRef}
            />
        </div>
    );
});
