import { ZoomIn, ZoomOut } from "lucide-react";

export default function ZoomControls({ zoom, setZoom }) {
  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
        className="flex items-center justify-center w-10 h-10 rounded-full 
        bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300
        shadow-sm hover:shadow-md hover:from-gray-200 hover:to-gray-300 
        active:scale-95 transition-all duration-200"
      >
        <ZoomOut size={18} className="text-gray-700" />
      </button>

      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[60px] text-center">
        {Math.round(zoom * 200)}%
      </span>

      <button
        onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
        className="flex items-center justify-center w-10 h-10 rounded-full 
        bg-gradient-to-br from-blue-500 to-blue-600 text-white border border-blue-400
        shadow-sm hover:shadow-md hover:from-blue-600 hover:to-blue-700 
        active:scale-95 transition-all duration-200"
      >
        <ZoomIn size={18} />
      </button>
    </div>
  );
}