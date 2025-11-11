export default function LineTools({ selected, updateElement }) {
  return (
    <div className="flex gap-2 items-center">
      {/* Stroke Width */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Width
        <input
          type="number"
          min="1"
          max="20"
          value={selected.strokeWidth || 1}
          onChange={(e) => updateElement(selected.id, 'strokeWidth', parseInt(e.target.value))}
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </label>

      {/* Stroke Color */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Color
        <input
          type="color"
          value={selected.stroke || "#000"}
          onChange={(e) => updateElement(selected.id, 'stroke', e.target.value)}
          className="w-12 h-8 border rounded-md cursor-pointer"
        />
      </label>

      {/* Opacity */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Opacity
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={selected.opacity || 1}
          onChange={(e) => updateElement(selected.id, 'opacity', parseFloat(e.target.value))}
          className="w-16"
        />
      </label>

      {/* Rotation */}
      <label className="flex flex-col text-xs gap-1 text-gray-600 dark:text-white">
        Rotate
        <input
          type="number"
          min="0"
          max="360"
          value={selected.rotation || 0}
          onChange={(e) => updateElement(selected.id, 'rotation', parseInt(e.target.value))}
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