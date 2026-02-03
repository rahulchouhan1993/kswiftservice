import { useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import RoundBtn from "@/Components/RoundBtn";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { useAlerts } from "./Alerts";

export default function StatusToggle({
    checked,
    action = false,
    tooltip = "",
    className = "",

    roundBtn = false,
    roundBtnProps = {},

    ...props
}) {
    const subRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        status: checked,
    });

    const { successAlert, errorAlert, errorsHandling } = useAlerts();
    const toggleStatus = () => {
        const newStatus = !data.status;
        setData("status", newStatus);

        if (action) {
            setTimeout(() => subRef.current?.click(), 50);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!action) return;

        post(action, {
            preserveScroll: true,
            onSuccess: () => {
                // successAlert("Status updated successfully");
            },
            onError: () => {
                // errorAlert("Something went wrong");
            },
        });
    };


    useEffect(() => { }, [errors]);

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
                    className={`
                        hover:text-white
                        hover:bg-gradient-to-r
                        hover:from-[#08365C]
                        hover:to-[#52C5FA]
                        transition
                        ${roundBtnProps.className || ''}
                    `}
                >
                    {roundBtnProps.icon ? (
                        roundBtnProps.icon
                    ) : data.status ? (
                        <MdToggleOn size={20} />
                    ) : (
                        <MdToggleOff size={20} />
                    )}

                    {roundBtnProps.label && (
                        <span className="ml-1">{roundBtnProps.label}</span>
                    )}
                </RoundBtn>

                <button ref={subRef} type="submit" className="hidden">
                    save
                </button>
            </form>
        );
    }

    /* =========================
       Default Toggle
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

                <div
                    className="
                        relative w-9 h-5 rounded-full
                        bg-gray-300 dark:bg-gray-700
                        after:content-[''] after:absolute
                        after:top-[2px] after:start-[2px]
                        after:h-4 after:w-4 after:bg-white
                        after:rounded-full after:transition-all
                        peer-checked:after:translate-x-full
                        transition

                        /* ✅ Checked = Gradient */
                        peer-checked:bg-gradient-to-r
                        peer-checked:from-[#08365C]
                        peer-checked:to-[#52C5FA]

                        /* ✅ Hover = Gradient */
                        hover:bg-gradient-to-r
                        hover:from-[#08365C]
                        hover:to-[#52C5FA]
                    "
                />
            </label>

            <button ref={subRef} type="submit" className="hidden">
                save
            </button>
        </form>
    );
}
