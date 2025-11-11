import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IoCloseSharp } from "react-icons/io5";

export default function Modal({
    zindex = 9999, // default z-index
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => { },
    topCloseButton = false,
    handleTopClose = () => { }
}) {

    const close = () => {
        if (closeable) handleTopClose();
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                className="fixed inset-0 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-0"
                style={{ zIndex: zindex }}
                onClose={() => { }}
            >
                {/* Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-black/50" />
                </Transition.Child>

                {/* Modal Panel */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`max-h-[100%] overflow-y-auto bg-white dark:bg-[#131836] border border-gray-500 dark:border-blue-900 rounded-lg shadow-xl transform transition-all w-full sm:mx-auto ${maxWidthClass}`}
                    >
                        {topCloseButton && (
                            <div className="relative">
                                <button
                                    type="button"
                                    className="absolute top-[4px] right-1 text-xl px-2 py-2
                                        text-white dark:text-gray-200
                                        bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500
                                        dark:bg-gray-700
                                        rounded-md
                                        hover:brightness-110
                                        dark:hover:bg-gray-600
                                        transition duration-200"
                                    onClick={handleTopClose}
                                >
                                    <IoCloseSharp />
                                </button>
                            </div>
                        )}

                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
