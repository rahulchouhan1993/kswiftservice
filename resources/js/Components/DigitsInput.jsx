import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function DigitsInput(
    { className = "", isFocused = false, maxLength = 10, onChange, ...props },
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
        if (value.length > maxLength) value = value.slice(0, maxLength);
        e.target.value = value;
        if (onChange) {
            e.persist();
            onChange(e);
        }
    };

    return (
        <input
            {...props}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={maxLength}
            className={
                "w-full rounded-md shadow-sm ring-0 dark:bg-[#131836] dark:text-gray-200 " +
                className
            }
            ref={localRef}
            onInput={handleInput}
        />
    );
});
