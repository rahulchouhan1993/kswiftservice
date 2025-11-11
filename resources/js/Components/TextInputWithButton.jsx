import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import PrimaryButton from "./PrimaryButton";

export default forwardRef(function TextInputWithButton(
    {
        inputType = "text",
        className = "",
        isFocused = false,
        buttonLabel = "Search",
        onButtonClick = () => {},
        placeholder = "",
        buttonType = "button",
        buttonWidth = "w-auto",
        buttonPadding = "px-4 py-2",
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
        <div className="flex w-full">
            <input
                {...props}
                type={inputType}
                ref={localRef}
                className={`
                    block p-2.5 w-full text-sm text-gray-900 bg-white
                    border border-gray-400 rounded-l-md
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    dark:bg-[#0a0e37] dark:border-blue-700 dark:text-white
                    ${className}
                `}
                placeholder={placeholder}
            />

            <PrimaryButton
                type={buttonType}
                onClick={onButtonClick}
                width={buttonWidth}
                padding={buttonPadding}
                className="rounded-l-none rounded-r-md"
            >
                {buttonLabel}
            </PrimaryButton>
        </div>
    );
});
