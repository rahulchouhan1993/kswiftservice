import { useState } from "react";

export default function VariableDropdown({ selected, updateElement, predefinedVariables }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = predefinedVariables.filter(v =>
        v.key.toLowerCase().includes(query.toLowerCase()) ||
        v.label.toLowerCase().includes(query.toLowerCase())
    );


  return (
    <div className="relative w-60">
      <input
        type="text"
        placeholder="➕ Insert Variable"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full border px-3 py-2 rounded-md text-sm bg-white dark:bg-[#131827] focus:ring-2 focus:ring-indigo-400"
      />

      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-[200px] bg-white dark:bg-[#131827] border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg scrollbar-thin">
            {filtered.map(v => (
                <li
                key={v.key}
                onClick={() => {
                    const newText = selected.text + ` {{${v.key}}} `;
                    updateElement(selected.id, "text", newText);
                    setQuery("");
                    setOpen(false);
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-700"
                >
                {v.label}
                </li>
            ))}
        </ul>
      )}
    </div>
  );
}
