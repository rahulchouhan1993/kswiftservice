import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { useTheme } from "next-themes";

/**
 * MultiSelection Dropdown with optional free text entry (comma-separated support).
 *
 * Props:
 * - options: array of available options [{ value, label }]
 * - preselected: array of preselected options
 * - placeholder: input placeholder
 * - onChange: function(selectedOptions)
 * - allowCreate: boolean, if true allows creating new options with comma/Enter
 */
export default function MultiSelection({
    onChange,
    options = [],
    placeholder = "Select options...",
    preselected = [],
    allowCreate = false,
}) {
    const { resolvedTheme } = useTheme();
    const [selectedOptions, setSelectedOptions] = useState(preselected || []);
    const [inputValue, setInputValue] = useState("");
    const [isDark, setIsDark] = useState(false);

    // Track dark mode changes
    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        updateTheme();
        return () => observer.disconnect();
    }, []);

    // Update preselected values
    useEffect(() => {
        if (preselected?.length > 0) {
            setSelectedOptions(preselected);
        }
    }, [preselected]);

    const handleChange = (selected) => {
        setSelectedOptions(selected || []);
        if (onChange) onChange(selected || []);
    };

    // Only allow creating new tags if allowCreate=true
    const handleKeyDown = (event) => {
        if (!allowCreate) return;

        if (event.key === "," || event.key === "Enter") {
            const newValue = inputValue.trim().replace(/,$/, "");
            if (newValue) {
                const newOption = { value: newValue, label: newValue };
                const newValues = [...selectedOptions, newOption];
                setSelectedOptions(newValues);
                if (onChange) onChange(newValues);
                setInputValue("");
            }
            event.preventDefault();
        }
    };

    // Custom dark/light theme styles
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: isDark ? "#0a0e37" : "#ffffff",
            borderColor: state.isFocused
                ? isDark
                    ? "#6366f1"
                    : "#2563eb"
                : isDark
                ? "#374151"
                : "#d1d5db",
            boxShadow: state.isFocused
                ? isDark
                    ? "0 0 0 1px #6366f1"
                    : "0 0 0 1px #2563eb"
                : "none",
            "&:hover": {
                borderColor: isDark ? "#818cf8" : "#2563eb",
            },
            color: isDark ? "#f3f4f6" : "#111827",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "#131836" : "#ffffff",
            color: isDark ? "#f3f4f6" : "#111827",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? isDark
                    ? "#374151"
                    : "#e5e7eb"
                : isDark
                ? "#131836"
                : "#ffffff",
            color: isDark ? "#f3f4f6" : "#111827",
            cursor: "pointer",
            ":active": {
                backgroundColor: isDark ? "#4b5563" : "#d1d5db",
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "#374151" : "#e5e7eb",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: isDark ? "#f3f4f6" : "#111827",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: isDark ? "#f3f4f6" : "#111827",
            ":hover": {
                backgroundColor: isDark ? "#4b5563" : "#d1d5db",
                color: isDark ? "#ffffff" : "#111827",
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: isDark ? "#9ca3af" : "#6b7280",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: isDark ? "#f3f4f6" : "#111827",
        }),
        input: (provided) => ({
            ...provided,
            color: isDark ? "#f3f4f6" : "#111827",
        }),
    };

    return (
        <CreatableSelect
            key={resolvedTheme}
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder={placeholder}
            styles={customStyles}
            classNamePrefix="react-select"
            inputValue={inputValue}
            onInputChange={(val) => setInputValue(val)}
            onKeyDown={handleKeyDown}
            isValidNewOption={() => allowCreate}
            isClearable
        />
    );
}
