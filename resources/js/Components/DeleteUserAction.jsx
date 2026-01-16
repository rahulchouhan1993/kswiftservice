import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ProcessingLoader from "./ProcessingLoader";
import RoundBtn from "@/Components/RoundBtn";
import { RiDeleteBinFill } from "react-icons/ri";

export default function DeleteUserAction({
    update,
    btntext,
    btnclasses,
    action,
    paylod = null,
    tooltip = null,
    message = "Are you sure to delete this user?",
    refreshAction = () => { },
    reload = false,
    zindex = "z-[9999]",

    /* 🔥 NEW PROPS */
    roundBtn = false,
    roundBtnProps = {},
}) {
    const { post, errors, processing } = useForm(paylod);
    const [open, setOpen] = useState(false);

    const handleDelete = (e) => {
        e.preventDefault();
        post(action, {
            preserveScroll: true,
            onSuccess: () => {
                update?.();
                setOpen(false);
                if (reload) window.location.reload();
                refreshAction();
            },
        });
    };

    /* =========================
       Trigger Button Renderer
       ========================= */
    const renderTrigger = () => {
        if (roundBtn) {
            return (
                <RoundBtn
                    onClick={() => setOpen(true)}
                    className={`
                        hover:text-white
                        hover:bg-gradient-to-r
                        hover:from-[#08365C]
                        hover:to-[#52C5FA]
                        transition
                        ${roundBtnProps.className || ''}
                    `}
                >
                    {roundBtnProps.icon}
                    {roundBtnProps.label && <span>{roundBtnProps.label}</span>}
                </RoundBtn>
            );
        }

        return (
            <button
                type="button"
                data-tooltip-target={tooltip}
                onClick={() => setOpen(true)}
                className={
                    btnclasses
                        ? btnclasses
                        : `
                            w-9 h-9 flex items-center justify-center rounded-full
                            border border-gray-200
                            text-[#52C5FA]
                            hover:text-white
                            hover:bg-gradient-to-r
                            hover:from-[#08365C]
                            hover:to-[#52C5FA]
                            transition
                            dark:border-gray-600
                        `
                }
            >
                {btntext ? btntext : <RiDeleteBinFill />}
            </button>
        );
    };

    return (
        <>
            {renderTrigger()}

            <Modal show={open} maxWidth="sm" zindex={zindex}>
                {processing ? (
                    <ProcessingLoader message="We are processing please wait...." />
                ) : (
                    <div className="p-4 md:p-5 flex flex-col items-center dark:bg-[#0a0e25]">

                        <DotLottieReact
                            src="https://lottie.host/ba644b2c-b7e8-4966-ab56-7fc834b4a541/B33sMcMth8.lottie"
                            loop
                            autoplay
                        />

                        <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400 text-center">
                            {message}
                        </h3>

                        <span className="text-xs text-red-600 mb-2">
                            {errors?.message}
                        </span>

                        <div className="flex gap-3">

                            {/* ✅ Delete (Danger stays RED) */}
                            <form onSubmit={handleDelete}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="
                                        text-white bg-red-600 hover:bg-red-700
                                        rounded-lg text-sm px-5 py-2.5
                                        transition
                                    "
                                >
                                    {processing ? "Deleting..." : "Yes, I'm sure"}
                                </button>
                            </form>

                            {/* ❌ Cancel (Brand Gradient) */}
                            <button
                                onClick={() => setOpen(false)}
                                type="button"
                                className="
                                    px-5 py-2.5 text-sm rounded-lg
                                    border border-gray-200
                                    text-[#08365C]
                                    hover:text-white
                                    hover:bg-gradient-to-r
                                    hover:from-[#08365C]
                                    hover:to-[#52C5FA]
                                    transition
                                    dark:border-gray-600
                                    dark:text-[#52C5FA]
                                "
                            >
                                No, cancel
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
