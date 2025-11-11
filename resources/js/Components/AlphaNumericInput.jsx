import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function AlphaNumericInput(
    { className = "", isFocused = false, ...props },
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

    const handleInput = (e) => {
        let value = e.target.value.replace(/[^a-zA-Z0-9]/g, ""); // ✅ Only A-Z, a-z, 0-9
        e.target.value = value;
        if (props.onChange) {
            e.persist();
            props.onChange(e);
        }
    };

    return (
        <input
            {...props}
            type="text"
            inputMode="text"
            pattern="[a-zA-Z0-9]*"
            className={
                "mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25] " +
                className
            }
            ref={localRef}
            onInput={handleInput}
        />
    );
});
