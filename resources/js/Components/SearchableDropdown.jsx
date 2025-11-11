import React, { useState, useRef, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";

export default function SearchableDropdown({
  label = "Select Option",
  options = [],
  onSelect,
  className = "",        // <-- NEW
  menuClassName = "",    // <-- NEW
  inputClassName = ""    // <-- NEW
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef(null);

  // Adjusted: handle objects {label, value} or plain strings
  const filteredOptions = options.filter((opt) => {
    const labelText = typeof opt === "object" ? opt.label : opt;
    return labelText.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (opt) => {
    setSelected(typeof opt === "object" ? opt.label : opt);
    onSelect?.(opt);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Trigger */}
      <div
        className="mt-1 flex items-center justify-between w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 cursor-pointer bg-white dark:bg-[#0a0e37] text-gray-800 dark:text-gray-200"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected || `--Select ${label}--`}
        <span className="ml-2 text-gray-500">&#9662;</span>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute z-20 mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-lg bg-white dark:bg-[#0a0e37] ${menuClassName}`}
        >
          {/* Search input */}
          <div className="flex items-center px-1 py-1 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${label}...`}
              className={`w-full bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 rounded-lg ${inputClassName}`}
            />
          </div>

          {/* List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const labelText = typeof opt === "object" ? opt.label : opt;
                return (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer text-gray-800 dark:text-gray-200"
                    onClick={() => handleSelect(opt)}
                  >
                    {labelText}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
