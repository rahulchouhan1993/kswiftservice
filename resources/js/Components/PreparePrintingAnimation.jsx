import { motion } from "framer-motion";

export default function PreparePrintingAnimation({ message = "Preparing your cards for printing..." }) {
    const cards = ["🃏", "🎴", "🖼️", "🧾"];

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-700 dark:text-gray-200">
            <p className="text-lg font-semibold mb-4 border-r-4 border-indigo-500 pr-2 overflow-hidden whitespace-nowrap w-[32ch] animate-typing-loop">
                {message}
            </p>

            <div className="relative mb-10">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-indigo-300 dark:ring-purple-700">
                    <div className="text-6xl">🖨️</div>
                </div>

                {/* Cards sliding out */}
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: [40, 0, -60], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                        className="absolute left-1/2 -translate-x-1/2 bottom-[-40px] text-3xl"
                    >
                        {card}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
