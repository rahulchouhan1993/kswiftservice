export default function ProcessingLoader({ message = "Processing your request..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-700 dark:text-gray-200">
            {/* Animated Avatar Circle */}
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse flex items-center justify-center shadow-2xl ring-4 ring-blue-300 dark:ring-indigo-700">
                    <svg
                        className="w-8 h-8 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                </div>
            </div>

            {/* Typing Text Loop Effect */}
            <p className="text-lg font-semibold mb-2 border-r-4 border-blue-500 pr-2 overflow-hidden whitespace-nowrap w-[26ch] animate-typing-loop">
                {message}
            </p>

            {/* Bouncing Dots */}
            <div className="flex space-x-1 mt-3">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:.1s]"></span>
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:.2s]"></span>
            </div>
        </div>
    );
}
