import { useState, useEffect } from "react";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { MdOutlinePassword } from "react-icons/md";

export default function Forgot({ isOpen, onClose, onSubmit }) {
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const handleOverlayClick = (e) => {
        if (e.target.id === "forgot-overlay") {
            onClose();
        }
    };

    const handleSubmit = () => {
        if (!email) return;
        onSubmit(email);
        setEmail("");
        onClose();
    };

    if (!isOpen) return null;



    return (
        <div
            id="forgot-overlay"
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
            <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-2xl shadow-lg w-full max-w-md p-6 transition-all duration-300">
                <div className="h-[200px] w-full mb-3 ">
                    <DotLottieReact
                        src="https://lottie.host/a9e06acf-6162-4f2e-b609-1fbb184669c5/ojHWTOwZmH.lottie"
                        loop
                        autoplay
                    />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
                    Enter your registered email to reset your password.
                </p>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-3 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

               <div className="flex items-start justify-start flex-col gap-2">
                 <p className=" text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2"> <MdOutlinePassword />Enter you OTP</p>
                <input
                    type="email"
                    placeholder="Enter your OTP"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=" w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
               </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                    >
                        <FaTimesCircle /> Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                    >
                        <FaCheckCircle /> Change
                    </button>
                </div>
            </div>
        </div>
    );
}
