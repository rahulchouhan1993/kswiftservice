import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function CheckboxInput(
    {
        id,
        name,
        label = "",
        isFocused = false,
        className = "",
        labelClassName = "",
        ...props
    },
    ref
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
        check: () => { localRef.current.checked = true; },
        uncheck: () => { localRef.current.checked = false; },
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <label htmlFor={id} className={"inline-flex items-center gap-1 cursor-pointer " + labelClassName}>
            <input
                {...props}
                type="checkbox"
                id={id}
                name={name}
                ref={localRef}
                className={
                    "rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-0 dark:bg-[#131836] dark:text-gray-200 " +
                    className
                }
            />
            <span className="text-gray-700 dark:text-gray-200">{label}</span>
        </label>
    );
});
