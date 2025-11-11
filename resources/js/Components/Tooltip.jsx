import { useState, useEffect, useRef } from 'react';

export default function Tooltip({ children, title, position = "top", classes = "" }) {
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
      {children}
      {visible && (
        <div className={`hidden sm:block  absolute z-50 px-3 py-1 mt-1 text-sm font-medium text-white bg-blue-950 rounded-md  ${position === "down" ? "bottom-full mt-2 -translate-x-1/2" : ""} ${classes}`}>
          {title}
        </div>
      )}
    </div>
  );
}
