import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function PriceInput(
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
    let value = e.target.value;

    // ✅ Allow digits and one dot
    value = value.replace(/[^0-9.]/g, "");

    // ✅ Prevent more than one dot
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // ✅ Enforce maxLength (including dot)
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    e.target.value = value;
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      pattern="[0-9]+(\.[0-9]+)?"
      maxLength={maxLength}
      className={
        "mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25] " +
        className
      }
      ref={localRef}
      onInput={handleInput}
    />
  );
});
