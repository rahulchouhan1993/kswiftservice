import { useState, useRef, useEffect } from "react";
import { CgInsertAfter } from "react-icons/cg";
import VariableDropdown from "./VariableDropdown";
import { FaAlignCenter, FaAlignJustify, FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const defaultFonts = [
  "Arial",
  "Courier", 
  "Georgia",
  "Times New Roman",
  "Roboto",
  "Poppins",
];

export default function TextTools({ selected, updateElement, selectedElementId, predefinedVariables }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [listText, setListText] = useState(
    selected.type === "orderedList" || selected.type === "unorderedList" 
      ? (selected.listItems || []).join("\n") 
      : ""
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleListTextChange = (value) => {
    setListText(value);
    const items = value.split("\n").filter(item => item.trim());
    updateElement(selected.id, "listItems", items);
    updateElement(selected.id, "text", value);
  };

  return (
    <div className="flex items-center space-x-4 ">
      {(selected.type === "orderedList" || selected.type === "unorderedList") && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            List Items (one per line):
          </label>
          <textarea
            value={listText}
            onChange={(e) => handleListTextChange(e.target.value)}
            className="w-48 h-16 border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827] resize-none"
            placeholder="Item 1\nItem 2\nItem 3"
          />
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-block cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mt-6 border border-black dark:border-blue-700"
        >
          <span><CgInsertAfter size={20} /></span>
        </div>
        {showDropdown && (
          <div 
            className="absolute top-[52px] left-0 z-50"
          >
            <VariableDropdown
              selected={selected}
              updateElement={updateElement}
              predefinedVariables={predefinedVariables}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="color"
          value={selected.color}
          onChange={(e) => updateElement(selected.id, "color", e.target.value)}
          className="w-8 h-7 "
        />
        <input
          type="number"
          value={selected.fontSize}
          onChange={(e) =>
            updateElement(selected.id, "fontSize", parseInt(e.target.value))
          }
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
          placeholder="Size"
        />
      </div>

      <select
        value={selected.fontFamily}
        onChange={(e) => updateElement(selected.id, "fontFamily", e.target.value)}
        className="w-fit border px-3 py-1 mt-4 rounded-md text-sm bg-white dark:bg-[#131827]"
      >
        {[...defaultFonts, "Lobster", "Montserrat", "Open Sans", "Oswald"].map(
          (f) => (
            <option key={f}>{f}</option>
          )
        )}
      </select>

      <div className="flex gap-1 flex-col ">
        <label className="block text-xs text-gray-600 dark:text-white ">Z-Index</label>
        <input
          type="number"
          value={selected.zIndex || 0}
          onChange={(e) =>
            updateElement(selected.id, "zIndex", parseInt(e.target.value))
          }
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 dark:text-white mb-1">Transform</label>
        <select
          value={selected.textTransform || "none"}
          onChange={(e) =>
            updateElement(selected.id, "textTransform", e.target.value)
          }
          className="w-auto border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        >
          <option value="none">None</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="lowercase">lowercase</option>
          <option value="capitalize">Capitalize Each Word</option>
          <option value="sentence">Sentence case</option>
          <option value="toggle">tOGGLE cASE</option>
        </select>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className={`px-3 py-1 border border-black dark:border-blue-700 rounded-md font-bold ${
            selected.bold ? "bg-indigo-100 dark:bg-indigo-900" : ""
          }`}
          onClick={() => updateElement(selected.id, "bold", !selected.bold)}
        >
          B
        </button>
        <button
          className={`px-3 py-1 border border-black dark:border-blue-700 rounded-md italic ${
            selected.italic ? "bg-indigo-100 dark:bg-indigo-900" : ""
          }`}
          onClick={() => updateElement(selected.id, "italic", !selected.italic)}
        >
          I
        </button>
        <button
          className={`px-3 border border-black dark:border-blue-700 rounded-md underline ${
            selected.underline ? "bg-indigo-100 dark:bg-indigo-900" : ""
          }`}
          onClick={() =>
            updateElement(selected.id, "underline", !selected.underline)
          }
        >
          U
        </button>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button 
          className="px-2 py-1.5 border border-black dark:border-blue-700  rounded-md text-xs"
          onClick={() => updateElement(selectedElementId, "textAlign", "left")}
        >
          <FaArrowLeft size={18} />
        </button>
        <button 
          className="px-2 py-1.5 border border-black dark:border-blue-700  rounded-md text-xs"
          onClick={() => updateElement(selectedElementId, "textAlign", "center")}
        >
          <FaAlignCenter size={18} />
        </button>
        <button 
          className="px-2 py-1.5 border border-black dark:border-blue-700  rounded-md text-xs"
          onClick={() => updateElement(selectedElementId, "textAlign", "right")}
        >
          <FaArrowRight size={18} />
        </button>
        <button 
          className="px-2 py-1.5 border border-black dark:border-blue-700  rounded-md text-xs"
          onClick={() => updateElement(selectedElementId, "textAlign", "justify")}
        >
          <FaAlignJustify size={18} />
        </button>
      </div>
      
    </div>
  );
}