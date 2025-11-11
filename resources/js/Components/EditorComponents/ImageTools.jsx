import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { GiHorizontalFlip, GiVerticalFlip } from "react-icons/gi";

export default function ImageTools({ selected, updateElement }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        <div className="flex-1 mt-2">
          <label className="block text-xs text-gray-600 dark:text-white mb-1">Border Width</label>
          <input
            type="number"
            value={selected.borderWidth}
            onChange={(e) =>
              updateElement(selected.id, "borderWidth", parseInt(e.target.value))
            }
            className="w-20 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
          />
        </div>
        <div className="mt-1.5">
          <label className="block text-xs text-gray-600 dark:text-white mb-1">Border Color</label>
          <input
            type="color"
            value={selected.borderColor}
            onChange={(e) =>
              updateElement(selected.id, "borderColor", e.target.value)
            }
            className="w-20 h-8 rounded border"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col">
          <label className="block text-xs text-gray-600 dark:text-white mb-1">Border Radius</label>
          <input
            type="number"
            value={selected.borderRadius}
            onChange={(e) =>
              updateElement(selected.id, "borderRadius", parseInt(e.target.value))
            }
            className="w-20 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 dark:text-white mb-1">Rotation</label>
          <input
            type="number"
            value={selected.rotation}
            onChange={(e) =>
              updateElement(selected.id, "rotation", parseFloat(e.target.value))
            }
            className="w-20 border px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white dark:bg-[#131827]"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="block text-xs text-gray-600 dark:text-white mb-[3px]">Flip</label>
        <div className="flex gap-2">
          <button
          className="flex-1 px-3 py-2 bg-gray-200 dark:bg-[#131827] border border-blue-900 rounded-md hover:bg-gray-300 flex items-center justify-center gap-1 text-xs"
          onClick={() => updateElement(selected.id, "flipX", !selected.flipX)}
        >
          <GiHorizontalFlip />
        </button>
        <button
          className="flex-1 px-3 py-2 bg-gray-200 dark:bg-[#131827] border border-blue-900 rounded-md hover:bg-gray-300 flex items-center justify-center gap-1 text-xs"
          onClick={() => updateElement(selected.id, "flipY", !selected.flipY)}
        >
          <GiVerticalFlip />
        </button>
        </div>
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
          value={selected.opacity}
          onChange={(e) =>
            updateElement(selected.id, "opacity", parseFloat(e.target.value))
          }
          className="w-full"
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