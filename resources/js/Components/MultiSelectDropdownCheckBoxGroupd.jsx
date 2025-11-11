import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function MultiSelectDropdownCheckBoxGroupd({
    groups = [],
    selected = [],
    onChange = () => {},
    placeholder = "-Filter-",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredGroups, setFilteredGroups] = useState(groups);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        const lower = term.toLowerCase();
        const filtered = groups.map(group => ({
            label: group.label,
            options: group.options.filter(opt =>
                opt.label.toLowerCase().includes(lower)
            )
        })).filter(group => group.options.length > 0);
        setFilteredGroups(filtered);
    };

    const toggleOption = (value) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const toggleGroup = (groupOptions) => {
        const allSelected = groupOptions.every(opt => selected.includes(opt.value));
        if (allSelected) {
            onChange(selected.filter(v => !groupOptions.map(o => o.value).includes(v)));
        } else {
            const newSelected = [...selected, ...groupOptions.map(o => o.value).filter(v => !selected.includes(v))];
            onChange(newSelected);
        }
    };

    const selectedLabels = groups.flatMap(g => g.options)
        .filter(o => selected.includes(o.value))
        .map(o => o.label);

    useEffect(() => {
        setFilteredGroups(groups);
    }, [JSON.stringify(groups)]);

    return (
        <div className="relative w-full sm:min-w-[150px]" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-2 py-2.5 border border-gray-400 dark:border-gray-600 bg-white dark:bg-[#0a0e25] text-gray-900 dark:text-gray-200 rounded-md shadow-sm text-sm flex justify-between items-center"
            >
                <span
                    className="truncate text-left"
                    title={selectedLabels.join(", ")}
                >
                    {selected.length === 0
                        ? placeholder
                        : selected.length <= 2
                        ? selectedLabels.join(", ")
                        : `${selected.length} - Selected`}
                </span>
                <IoIosArrowDown className="ml-2 shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute mt-1 w-full z-50 bg-white dark:bg-[#0a0e25] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
                    <div className="px-3 py-2">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {filteredGroups.length > 0 ? (
                        filteredGroups.map((group) => {
                            const allGroupSelected = group.options.every(opt => selected.includes(opt.value));
                            return (
                                <div key={group.label}>
                                    <label
                                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={allGroupSelected}
                                            onChange={() => toggleGroup(group.options)}
                                            className="mr-2 rounded-full text-green-500"
                                        />
                                        {group.label}
                                    </label>
                                    {group.options.map(option => (
                                        <label
                                            key={option.value}
                                            className="flex items-center px-8 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(option.value)}
                                                onChange={() => toggleOption(option.value)}
                                                className="mr-2 rounded-full text-green-500"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No results
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
