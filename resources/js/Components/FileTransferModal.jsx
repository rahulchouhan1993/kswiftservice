import { useEffect, useState, useRef } from "react";
import SecondaryButton from "@/Components/SecondaryButton";

export default function FileTransferModal({ importing, countdown, progressPercent, closeModal }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const pathRef = useRef(null);

    useEffect(() => {
        if (!pathRef.current) return;

        const path = pathRef.current;
        const pathLength = path.getTotalLength();

        // Calculate point along the path based on progress
        const point = path.getPointAtLength((progressPercent / 100) * pathLength);
        setPosition({ x: point.x, y: point.y });
    }, [progressPercent]);

    if (!importing || countdown === null) return null;

    return (
        <div className="flex flex-col items-center gap-6 mt-6">
            {/* SVG Path for Curved Animation */}
            <svg width="400" height="150" className="absolute opacity-0 pointer-events-none">
                <path
                    ref={pathRef}
                    d="M 40 100 Q 200 20 360 100"
                    stroke="black"
                    fill="transparent"
                />
            </svg>

            <div className="relative flex items-center gap-10 w-full max-w-lg h-[150px]">
                {/* Source Folder */}
                <div className="flex flex-col items-center">
                    <div className="text-5xl">📂</div>
                    <span className="text-xs text-gray-600 mt-1">Source</span>
                </div>

                {/* File moving along curve */}
                <div className="absolute left-0 top-0 w-full h-full">
                    <div
                        className="absolute transition-all duration-500 ease-linear"
                        style={{ left: position.x, top: position.y }}
                    >
                        <div className="text-3xl animate-bounce">📄</div>
                    </div>
                </div>

                {/* Destination Folder */}
                <div className="flex flex-col items-center absolute right-0 bottom-0">
                    <div className="text-5xl">📁</div>
                    <span className="text-xs text-gray-600 mt-1">Destination</span>
                </div>
            </div>

            {/* Progress text with countdown */}
            <p className="text-sm text-gray-700 font-medium animate-pulse">
                Transferring files... {progressPercent.toFixed(2)}% ⏳ {countdown}s left
            </p>

            {/* Close button */}
            <div className="flex justify-end pt-2">
                <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
            </div>
        </div>
    );
}
