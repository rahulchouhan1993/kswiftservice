import { useState } from "react";

export default function CustomDateDotInput({ value, className, onChange, ...props }) {
    const currentYear = new Date().getFullYear();

    const formatDate = (input) => {
        const cleaned = input.replace(/\D/g, '');
        let dd = '', mm = '', yyyy = '';

        if (cleaned.length >= 1) dd = cleaned.slice(0, 2);
        if (cleaned.length >= 3) mm = cleaned.slice(2, 4);
        if (cleaned.length >= 5) yyyy = cleaned.slice(4, 8);

        if (parseInt(dd) > 31) dd = '';
        if (parseInt(mm) > 12) mm = '';
        if (parseInt(yyyy) > currentYear) yyyy = currentYear.toString();

        let formatted = '';
        if (dd) formatted += dd;
        if (mm) formatted += '.' + mm;
        if (yyyy) formatted += '.' + yyyy;

        return formatted;
    };

    const handleChange = (e) => {
        const input = e.target.value;
        const formatted = formatDate(input);
        onChange({ target: { value: formatted } }); // Call parent `onChange`
    };

    return (
        <input
            type="text"
            maxLength={10}
            value={value}
            onChange={handleChange}
            placeholder="DD.MM.YYYY"
            className={
                "mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-0 focus:border-gray-500 text-gray-900 dark:text-gray-200 dark:bg-[#0a0e25]  " +
                className
            }
            {...props}
        />
    );
}
