import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";

export default function Modal({
    zindex = 9999,
    children,
    show = false,
    maxWidth = "2xl",
    topCloseButton = false,
    handleTopClose = () => { },
}) {
    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
        "3xl": "sm:max-w-3xl",
        "4xl": "sm:max-w-4xl",
        "5xl": "sm:max-w-5xl",
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment}>
            <Dialog
                as="div"
                static                 // 🔥 1️⃣ disables outside-click close
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ zIndex: zindex }}
                onClose={() => { }}     // 🔥 2️⃣ block Headless UI auto-close
            >
                {/* Overlay (visual only, NOT clickable) */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-black/50"
                        onPointerDownCapture={(e) => e.stopPropagation()} // 🔥 3️⃣ block capture
                    />
                </Transition.Child>

                {/* Modal Panel */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`relative w-full ${maxWidthClass} mx-4
                                    max-h-[90vh] overflow-y-auto
                                    bg-white dark:bg-[#131836]
                                    border border-gray-500 dark:border-blue-900
                                    rounded-lg shadow-xl`}
                        onPointerDownCapture={(e) => e.stopPropagation()} // 🔥 MOST IMPORTANT
                        onMouseDownCapture={(e) => e.stopPropagation()}   // Safari safety
                    >
                        {/* Close Button (ONLY WAY TO CLOSE) */}
                        {topCloseButton && (
                            <button
                                type="button"
                                onClick={handleTopClose}
                                className="absolute top-2 right-2 z-10
                                           text-xl px-2 py-2
                                           text-white dark:text-gray-200
                                           bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500
                                           rounded-md hover:brightness-110 transition"
                            >
                                <IoCloseSharp />
                            </button>
                        )}

                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
