import { LuLayoutDashboard } from "react-icons/lu";
import { useState } from "react";

const pvcCardSizes = [
  { label: "ID-1 (Credit Card)", width: 338, height: 214 },
  { label: "ID-2 (ID Card)", width: 413, height: 290 },
  { label: "ID-3 (Passport)", width: 492, height: 346 },
  { label: "CR80 (Standard PVC)", width: 337, height: 216 },
  { label: "CR79 (Smaller PVC)", width: 327, height: 208 },
  { label: "CR100 (Large PVC)", width: 441, height: 299 },
];

export default function EditorControlsandLayout({
  canvasSize,
  resizeCanvas,
  orientation,
  setOrientation,
  backgroundFit,
  setBackgroundFit
}) {
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [unit, setUnit] = useState('px');

  const convertToPixels = (value, unit) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    
    switch (unit) {
      case 'px': return num;
      case 'mm': return num * 3.78; // 1mm = 3.78px at 96 DPI
      case 'cm': return num * 37.8; // 1cm = 37.8px at 96 DPI
      case 'ratio': return num;
      default: return num;
    }
  };

  const applyCustomSize = () => {
    if (!customWidth || !customHeight) return;
    
    const widthPx = convertToPixels(customWidth, unit);
    const heightPx = convertToPixels(customHeight, unit);
    
    if (widthPx > 0 && heightPx > 0) {
      resizeCanvas(Math.round(widthPx), Math.round(heightPx));
    }
  };
  return (
    <div>
      {/* Controls and layout */}
      <div className="w-full flex flex-col gap-3 items-start p-1 rounded-xl shadow-sm  backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <LuLayoutDashboard />Controls & Layout
        </h3>
        {/* Card Size */}
        <div className="flex gap-1 flex-col items-start w-full">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">Card Size:</label>
          <select
            value={`${canvasSize.width}x${canvasSize.height}`}
            onChange={(e) => {
              const [newW, newH] = e.target.value.split("x").map(Number);
              resizeCanvas(newW, newH);
            }}
            className="w-full px-3 py-2 pr-7 text-xs rounded-md border border-gray-300 dark:border-blue-700 
        bg-white dark:bg-[#131837] shadow-sm"
          >
            {pvcCardSizes.map((size) => (
              <option key={size.label} value={`${size.width}x${size.height}`}>
                {`${size.label} – ${size.width} × ${size.height} px`}
              </option>
            ))}
          </select>
        </div>

        {/* Orientation Controls */}
        <div className="flex flex-col gap-2 items-start w-full">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Orientation
          </label>

          <div className="flex items-center gap-2 w-full">
            {/* Landscape */}
            <button
              onClick={() => setOrientation("landscape")}
              className={`flex items-center w-1/2 gap-1 px-3 py-1.5 text-sm rounded-md transition-all duration-200
      ${orientation === "landscape"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="7" width="18" height="10" rx="2" ry="2"
                  strokeWidth="2" stroke="currentColor" fill="none" />
              </svg>
              Landscape
            </button>

            {/* Portrait */}
            <button
              onClick={() => setOrientation("portrait")}
              className={`flex items-center w-1/2 gap-1 px-3 py-1.5 text-sm rounded-lg transition-all duration-200
      ${orientation === "portrait"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="7" y="3" width="10" height="18" rx="2" ry="2"
                  strokeWidth="2" stroke="currentColor" fill="none" />
              </svg>
              Portrait
            </button>
          </div>
        </div>

        {/* Custom Size */}
        <div className="flex flex-col gap-2 items-start w-full">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Custom Size
          </label>
          <div className="flex items-end gap-2">
            <div className="flex items-start gap-1 flex-col">
              <label className="text-xs">Width:</label>
              <input 
                type="number" 
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                className="border border-gray-300 dark:border-blue-700 rounded-md px-2 py-1 bg-white dark:bg-[#0a0e37] w-20 text-xs" 
              />
            </div>
            <div className="flex items-start gap-1 flex-col">
              <label className="text-xs">Height:</label>
              <input 
                type="number" 
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                className="border border-gray-300 dark:border-blue-700 rounded-md px-2 py-1 bg-white dark:bg-[#0a0e37] w-20 text-xs" 
              />
            </div>
            <div className="flex items-start gap-1 flex-col">
              <label className="text-xs font-medium">
                Unit:
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="border border-gray-300 dark:border-blue-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-[#0a0e37] w-16"
              >
                <option value="px">px</option>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
              </select>
            </div>
            <button
              onClick={applyCustomSize}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply
            </button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Current: {canvasSize.width} × {canvasSize.height} px
          </div>
        </div>

        {/* Background Fit */}
        <div className="flex flex-col gap-2 items-start w-full">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Background Fit
          </label>

          <div className="relative w-full">
            <select
              value={backgroundFit}
              onChange={(e) => setBackgroundFit(e.target.value)}
              className="appearance-none w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-blue-700
       text-gray-700 dark:text-gray-200
       bg-white dark:bg-[#131837]
      shadow-sm hover:shadow-md 
      transition-all duration-200 outline-none cursor-pointer"
            >
              <option value="cover">✨ Cover</option>
              <option value="contain">📐 Contain</option>
              <option value="100% 100%">🔲 Stretch</option>
              <option value="auto">⚡ Auto</option>
            </select>

            {/* Custom Dropdown Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}