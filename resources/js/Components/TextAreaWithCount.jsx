import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export default forwardRef(function TextAreaWithCount(
    {
        type = "text",
        className = "",
        isFocused = false,
        maxLength = 500,
        showCount = true,
        ...props
    },
    ref
) {
    const localRef = useRef(null);
    const [charCount, setCharCount] = useState(props.value?.length || 0);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const handleChange = (e) => {
        setCharCount(e.target.value.length);
        props.onChange && props.onChange(e);
    };

    return (
        <div className="relative w-full">
            <textarea
                {...props}
                maxLength={maxLength}
                type={type}
                className={
                    "rounded-md shadow-sm ring-0 dark:bg-[#131836] dark:text-gray-200 w-full pr-10 pb-6 " + // extra space for count
                    className
                }
                ref={localRef}
                onChange={handleChange}
            />
            {showCount && (
                <div className="absolute bottom-[10px] right-2 text-xs text-gray-400 pointer-events-none">
                    {charCount}/{maxLength}
                </div>
            )}
        </div>
    );
});
