import { useState, useEffect, useRef, useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function MultiSelectDropdownCheckBox({
  options = [],
  selected = [],
  onChange = () => {},
  placeholder = "-Filter-",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize selected -> always an array of values (IDs or primitives)
  const selectedValues = useMemo(() => {
    if (!selected) return [];
    // If it's already an array, map objects -> their .value, primitives stay as-is
    if (Array.isArray(selected)) {
      return selected.map((s) => (typeof s === "object" && s !== null ? s.value : s));
    }
    // if single object -> return [value], if single primitive -> [primitive]
    return [typeof selected === "object" && selected !== null ? selected.value : selected];
  }, [selected]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) searchInputRef.current.focus();
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

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.value));
    }
  };

  const selectedLabels = options
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.label);

  const allSelected = selectedValues.length === options.length && options.length > 0;

  return (
    <div className="relative w-full sm:min-w-[150px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-2.5 border border-gray-400 dark:border-gray-600 bg-white dark:bg-[#0a0e25] 
                   text-gray-900 dark:text-gray-200 rounded-md shadow-sm text-sm flex justify-between items-center"
      >
        <span className="truncate text-left" title={selectedLabels.join(", ")}>
          {selectedValues.length === 0
            ? placeholder
            : selectedValues.length <= 2
            ? selectedLabels.join(", ")
            : `${selectedValues.length} - Selected`}
        </span>
        <IoIosArrowDown className="ml-2 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full z-50 bg-white dark:bg-[#0a0e25] border border-gray-300 
                        dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
          <div className="px-3 py-2">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>

          {options.length > 1 && (
            <label
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 
                         hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600"
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="mr-2 rounded-full text-green-500"
              />
              Select All
            </label>
          )}

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                           hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="mr-2 rounded-full text-green-500"
                />
                {option.label}
              </label>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No results</div>
          )}
        </div>
      )}
    </div>
  );
}
