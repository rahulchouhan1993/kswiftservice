import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ProcessingLoader from "./ProcessingLoader";
import RoundBtn from "@/Components/RoundBtn";

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
                    className={roundBtnProps.className}
                >
                    {roundBtnProps.icon}
                    {roundBtnProps.label && <span>{roundBtnProps.label}</span>}
                </RoundBtn>
            );
        }

        // ✅ existing behavior (unchanged)
        return (
            <button
                type="button"
                className={
                    btnclasses
                        ? btnclasses
                        : "w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 dark:hover:bg-red/10 text-gray-900 dark:text-gray-200 hover:text-white transition"
                }
                data-tooltip-target={tooltip}
                onClick={() => setOpen(true)}
            >
                {btntext ? (
                    btntext
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166"
                        />
                    </svg>
                )}
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

                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 text-center">
                            {message}
                        </h3>

                        <span className="text-xs text-red-600 mb-2">
                            {errors?.message}
                        </span>

                        <div className="flex gap-3">
                            <form onSubmit={handleDelete}>
                                <button
                                    type="submit"
                                    className="text-white bg-red-600 hover:bg-red-700
                                               rounded-lg text-sm px-5 py-2.5"
                                    disabled={processing}
                                >
                                    {processing ? "Deleting..." : "Yes, I'm sure"}
                                </button>
                            </form>

                            <button
                                onClick={() => setOpen(false)}
                                type="button"
                                className="px-5 py-2.5 text-sm rounded-lg
                                           bg-white border border-gray-200
                                           hover:bg-gray-100 dark:bg-[#131836]
                                           dark:border-gray-600 dark:text-gray-400
                                           dark:hover:bg-gray-700"
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
