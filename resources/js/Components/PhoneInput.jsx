import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function PhoneInput(
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
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value;
        if (props.onChange) {
            e.persist();
            props.onChange(e);
        }
    };

    return (
        <input
            {...props}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            className={
                "mt-1 block w-full border-gray-500 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e37]  " +
                className
            }
            ref={localRef}
            onInput={handleInput}
        />
    );
});
