import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function SelectInput(
    {
        id,
        className = "",
        options = [],
        value,
        onChange,
        isFocused = false,
        placeholder = "-Select-",
        ...props
    },
    ref
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            id={id}
            ref={localRef}
            className={
                "mt-1 block w-full rounded-md border-gray-500 dark:border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-[#0a0e37] dark:text-white " +
                className
            }
            value={value}
            onChange={onChange}
            {...props}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});
