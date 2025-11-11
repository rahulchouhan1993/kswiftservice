export default function ShapeTools({ selected, updateElement }) {
  return (
    <div className=" flex space-x-3 items-center justify-center">
      <div className="flex gap-1">
        <div className="flex flex-col">
          <label className="block text-xs text-gray-600 dark:text-white mb-1">Fill</label>
          <input
            type="color"
            value={selected.fill || "#FF0000"}
            onChange={(e) => updateElement(selected.id, "fill", e.target.value)}
            className="w-9 h-7 rounded border"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 dark:text-white mb-1">Stroke</label>
          <input
            type="color"
            value={selected.stroke || "#000"}
            onChange={(e) => updateElement(selected.id, "stroke", e.target.value)}
            className="w-full h-7 rounded border"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs text-gray-600 dark:text-white mb-1">Stroke Width</label>
        <input
          type="number"
          value={selected.strokeWidth || 2}
          onChange={(e) =>
            updateElement(selected.id, "strokeWidth", parseInt(e.target.value))
          }
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </div>
      
      <div>
        <label className="block text-xs text-gray-600 dark:text-white mb-1">
          Opacity ({Math.round((selected.opacity || 1) * 100)}%)
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={selected.opacity || 1}
          onChange={(e) =>
            updateElement(selected.id, "opacity", parseFloat(e.target.value))
          }
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-xs text-gray-600 dark:text-white mb-1">Rotation</label>
        <input
          type="number"
          value={selected.rotation || 0}
          onChange={(e) =>
            updateElement(selected.id, "rotation", parseFloat(e.target.value))
          }
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </div>
      
      <div>
        <label className="block text-xs text-gray-600 dark:text-white mb-1">Z-Index</label>
        <input
          type="number"
          value={selected.zIndex || 0}
          onChange={(e) =>
            updateElement(selected.id, "zIndex", parseInt(e.target.value))
          }
          className="w-16 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
        />
      </div>
    </div>
  );
}