import { useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import RoundBtn from "@/Components/RoundBtn";
import { MdToggleOn, MdToggleOff } from "react-icons/md";

export default function StatusToggle({
    checked,
    action = false,
    tooltip = "",
    className = "",

    /* 🔥 NEW */
    roundBtn = false,
    roundBtnProps = {},

    ...props
}) {
    const subRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        status: checked,
    });

    /* ---------------- Toggle Logic ---------------- */
    const toggleStatus = () => {
        const newStatus = !data.status;
        setData("status", newStatus);

        if (action) {
            setTimeout(() => {
                subRef.current?.click();
            }, 50);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (action) {
            post(action, {
                preserveScroll: true,
            });
        }
    };

    useEffect(() => {
        // console.log("StatusToggle errors", errors);
    }, [errors]);

    /* =========================
       RoundBtn Mode
       ========================= */
    if (roundBtn) {
        return (
            <form onSubmit={handleSubmit}>
                <RoundBtn
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus();
                    }}
                    className={roundBtnProps.className}
                >
                    {roundBtnProps.icon ? (
                        roundBtnProps.icon
                    ) : data.status ? (
                        <MdToggleOn size={18} />
                    ) : (
                        <MdToggleOff size={18} />
                    )}

                    {roundBtnProps.label && (
                        <span>{roundBtnProps.label}</span>
                    )}
                </RoundBtn>

                <button ref={subRef} type="submit" className="hidden">
                    save
                </button>
            </form>
        );
    }

    /* =========================
       Default Toggle (UNCHANGED)
       ========================= */
    return (
        <form onSubmit={handleSubmit} className="flex">
            <label
                className={`inline-flex items-center mb-5 cursor-pointer ${className}`}
                {...props}
            >
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={data.status}
                    onChange={toggleStatus}
                    readOnly={processing}
                />

                <div className="relative w-9 h-5 bg-gray-200
                                rounded-full peer dark:bg-gray-700
                                peer-checked:after:translate-x-full
                                after:content-[''] after:absolute after:top-[2px]
                                after:start-[2px] after:bg-white after:border
                                after:rounded-full after:h-4 after:w-4
                                after:transition-all
                                peer-checked:bg-[#008F70]" />
            </label>

            <button ref={subRef} type="submit" className="hidden">
                save
            </button>
        </form>
    );
}
