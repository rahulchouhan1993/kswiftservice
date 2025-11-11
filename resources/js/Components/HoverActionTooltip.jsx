import { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";

export default function HoverMessageTooltip({ trigger, messages = [], position = "top" }) {
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleMouseEnter = () => setVisible(true);
        const handleMouseLeave = () => setVisible(false);

        const el = ref.current;
        if (el) {
            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (el) {
                el.removeEventListener("mouseenter", handleMouseEnter);
                el.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, []);

    return (
        <div className="relative inline-block" ref={ref}>
            <div onClick={() => setShow(!show)} className="cursor-pointer dark:text-white text-gray-800">
                {trigger || <FaEllipsisV />}
            </div>

            {visible && (
                <div
                    className={`
                        absolute z-50 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
                        bg-white/90 dark:bg-[#131836] backdrop-blur
                        max-w-[200px] w-max
                        transition-opacity duration-200 ease-in-out
                        ${position === "top" ? "bottom-full right-0 " : ""}
                        ${position === "bottom" ? "top-full right-0 " : ""}
                        ${position === "left" ? "right-full top-0 " : ""}
                        ${position === "right" ? "left-full top-0 " : ""}
                    `}
                >
                    {messages.length > 0 ? (
                        messages.map((msg, idx) => (
                            <div key={idx} className="min-w-[150px] text-gray-800 dark:text-gray-200 text-sm px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0a0e25] cursor-pointer ">
                                {msg}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-gray-400">No messages</div>
                    )}
                </div>
            )}
        </div>
    );
}
