export default function TableTools({ selected, updateElement }) {
  const handleRowsChange = (newRows) => {
    const rows = Math.max(1, Math.min(10, newRows));
    updateElement(selected.id, 'rows', rows);
  };

  const handleColsChange = (newCols) => {
    const cols = Math.max(1, Math.min(10, newCols));
    updateElement(selected.id, 'cols', cols);
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Rows */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Rows
        <input
          type="number"
          min="1"
          max="10"
          value={selected.rows || 3}
          onChange={(e) => handleRowsChange(parseInt(e.target.value))}
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </label>

      {/* Columns */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Cols
        <input
          type="number"
          min="1"
          max="10"
          value={selected.cols || 3}
          onChange={(e) => handleColsChange(parseInt(e.target.value))}
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </label>

      {/* Border Width */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Border
        <input
          type="number"
          min="0"
          max="10"
          value={selected.borderWidth || 1}
          onChange={(e) => updateElement(selected.id, 'borderWidth', parseInt(e.target.value))}
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </label>

      {/* Border Color */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Border
        <input
          type="color"
          value={selected.borderColor || "#000"}
          onChange={(e) => updateElement(selected.id, 'borderColor', e.target.value)}
          className="w-12 h-8 border rounded-md cursor-pointer"
        />
      </label>

      {/* Text Color */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Text
        <input
          type="color"
          value={selected.textColor || "#000"}
          onChange={(e) => updateElement(selected.id, 'textColor', e.target.value)}
          className="w-12 h-8 border rounded-md cursor-pointer"
        />
      </label>

      {/* Font Size */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Font
        <input
          type="number"
          min="8"
          max="24"
          value={selected.fontSize || 12}
          onChange={(e) => updateElement(selected.id, 'fontSize', parseInt(e.target.value))}
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </label>

      {/* Cell Padding */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Padding
        <input
          type="number"
          min="0"
          max="20"
          value={selected.cellPadding || 5}
          onChange={(e) => updateElement(selected.id, 'cellPadding', parseInt(e.target.value))}
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </label>
      
      {/* Z-Index */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Z-Index
        <input
          type="number"
          value={selected.zIndex || 0}
          onChange={(e) => updateElement(selected.id, 'zIndex', parseInt(e.target.value))}
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </label>
    </div>
  );
}