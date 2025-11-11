import React, { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { CiSaveDown1 } from "react-icons/ci";
import { IoIosCloseCircle } from "react-icons/io";
import html2canvas from "html2canvas";
import { MdOutlineDesignServices } from "react-icons/md";

const EditPopup = ({ isOpen, onClose, SelectedDesign }) => {
    const [customImages, setCustomImages] = useState({});
    const [currentEditingName, setCurrentEditingName] = useState(null);
    const [zoom, setZoom] = useState(3);
    const [selectedElement, setSelectedElement] = useState(null);
    const [color, setColor] = useState("#000000");

    const containerRef = useRef();
    const fileInputRef = useRef();
    const pickerRef = useRef();

    const handleImageClick = (name) => {
        setCurrentEditingName(name);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomImages((prev) => ({
                    ...prev,
                    [currentEditingName]: reader.result
                }));
                setCurrentEditingName(null);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        const container = containerRef.current;
        const handleClick = (e) => {
            const el = e.target;
            if (["text", "rect", "polygon", "path"].includes(el.tagName.toLowerCase())) {
                const fill = el.getAttribute("fill") || "#000000";
                setSelectedElement(el);
                setColor(fill);
            }
        };

        container.addEventListener("click", handleClick);
        return () => container.removeEventListener("click", handleClick);
    }, [isOpen, SelectedDesign]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target) &&
                !containerRef.current.contains(event.target)
            ) {
                setSelectedElement(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleColorChange = (newColor) => {
        setColor(newColor.hex);
        if (selectedElement) {
            selectedElement.setAttribute("fill", newColor.hex);
        }
    };

    const handleSave = async () => {
        const element = containerRef.current;
        if (!element) return;

        const inner = element.querySelector(".capture-target");
        const originalTransform = inner.style.transform;

        inner.style.transform = "scale(1)";
        await new Promise((r) => setTimeout(r, 50));

        const canvas = await html2canvas(element, {
            useCORS: true,
            backgroundColor: "#fff",
            scale: 1,
            scrollY: -window.scrollY,
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "edited_design.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        inner.style.transform = originalTransform;
    };

    if (!isOpen || !SelectedDesign) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 w-[96%] h-[96%] flex flex-col items-center relative overflow-hidden">

                {selectedElement && (
                    <div className="absolute bottom-4 right-4 z-50" ref={pickerRef}>
                        <SketchPicker color={color} onChangeComplete={handleColorChange} />
                    </div>
                )}

                <div className="w-full flex justify-between items-center">
                    <div className="text-xl font-bold flex items-center gap-2"><MdOutlineDesignServices /><p>Edit Your design</p></div>

                    <div className="flex items-center gap-3">
                        <label className="text-gray-800 dark:text-gray-200 font-medium">Zoom:</label>
                        <input
                            type="range"
                            min="1"
                            max="6"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-40 accent-blue-500"
                        />
                        <span className="text-gray-800 dark:text-gray-200">{zoom.toFixed(1)}x</span>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            <CiSaveDown1 className="text-xl" />
                            Save
                        </button>
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            <IoIosCloseCircle className="text-xl" />
                            Cancel
                        </button>

                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="flex justify-center items-center overflow-auto w-full border border-black "
                >
                    <div
                        
                        className="capture-target origin-top  border border-red-800 "
                        style={{ transform: `scale(${zoom})` }}
                    >
                        <SelectedDesign 
                            
                            showTitle={false}
                            customImages={customImages}
                            onImageClick={handleImageClick}
                        />
                    </div>

                </div>




                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </div>
        </div>
    );
};

export default EditPopup;
