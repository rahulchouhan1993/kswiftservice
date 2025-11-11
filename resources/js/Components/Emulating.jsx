export default function Emulating({ emulate }) {
    const emulateMsg =  "Emulating...";

    return (
        <div className="flex items-center gap-1 sm:gap-2 bg-yellow-50 text-yellow-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-yellow-300 shadow-sm">
            {/* Animated dot instead of full spinner */}
            <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-yellow-500"></span>
            </span>
            <span className="font-medium text-[9px] sm:text-xs tracking-wide">
                {emulateMsg}
            </span>
        </div>
    );
}
