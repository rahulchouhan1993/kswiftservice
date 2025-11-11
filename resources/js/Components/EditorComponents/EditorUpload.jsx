import { useState } from "react";
import { MdFileUpload } from "react-icons/md";

export default function EditorUpload({
    background,
    setBackground,
    setCanvasSize,
    addElement,
    designData,
    setPinnedTab,
    hoveredTab
}) {

    const handleBackgroundUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const maxWidth = 900;
                const maxHeight = 650;
                let width = img.width;
                let height = img.height;

                const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
                width = width * ratio;
                height = height * ratio;

                setCanvasSize({ width, height });
            };
            img.src = reader.result;
            setBackground(reader.result);
        };
        reader.readAsDataURL(file);
    };


    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const maxSize = 200;
                let width = img.width;
                let height = img.height;
                
                if (width > maxSize || height > maxSize) {
                    const ratio = Math.min(maxSize / width, maxSize / height);
                    width = width * ratio;
                    height = height * ratio;
                }
                
                addElement("image", { 
                    src: reader.result,
                    width: Math.round(width),
                    height: Math.round(height)
                });
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
        
        e.target.value = '';
    };

    return (
        <div>
            {/* Uploads */}
            <div className="flex flex-col gap-2 p-1">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <MdFileUpload />Upload Your Files
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Background Upload */}
                    <label className="w-full group cursor-pointer flex flex-col items-center justify-center h-28
          rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 
          shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">

                        <div className="flex flex-col items-center gap-2 p-1 ">
                            {/* Icon */}
                            <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-purple-100 transition">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-purple-600"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3" />
                                </svg>
                            </div>
                            {/* Label */}
                            <span className="text-sm font-medium text-purple-700">Background</span>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBackgroundUpload}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (hoveredTab && setPinnedTab) {
                                    setPinnedTab(hoveredTab);
                                }
                            }}
                            className="hidden"
                        />
                    </label>

                    {/* Image Upload */}
                    <label className="w-full group cursor-pointer flex flex-col items-center justify-center h-28
          rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 
          shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">

                        <div className="flex flex-col items-center gap-2 p-1">
                            {/* Icon */}
                            <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-orange-100 transition">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-orange-600"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3" />
                                </svg>
                            </div>
                            {/* Label */}
                            <span className="text-sm font-medium text-orange-700">Upload</span>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (hoveredTab && setPinnedTab) {
                                    setPinnedTab(hoveredTab);
                                }
                            }}
                            className="hidden"
                        />
                    </label>
                </div>


            </div>
            
        </div>
    );
}
