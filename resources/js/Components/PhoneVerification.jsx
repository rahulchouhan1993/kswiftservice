import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAlerts } from "./Alerts";

export default function PhoneVerification({
    maxLen = null,
    value = "",
    onChange,
    onVerified,
    disabled = false,
    initiallyVerified = false,
    isRequired = false,
    originalPhone, // actual phone for OTP, optional
    maskPhone = false, // optional masking
}) {
    const [inputValue, setInputValue] = useState(value || "");
    const [otpSent, setOtpSent] = useState(false);
    const [otpInputs, setOtpInputs] = useState(Array(6).fill(""));
    const [countdown, setCountdown] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [otpProcessing, setOtpProcessing] = useState(false);
    const [isVerified, setIsVerified] = useState(initiallyVerified);
    const otpRefs = useRef([]);
    const { successAlert, errorAlert } = useAlerts();
    const phoneToSend = originalPhone || inputValue;

    // keep inputValue synced with parent value
    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    // countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    // reset verification if phone changes
    useEffect(() => {
        if (isVerified) {
            setIsVerified(false);
            if (onVerified) onVerified(false, null);
        }
    }, [value]);

    const handleInputChange = (e) => {
        const val = e.target.value.replace(/\D/g, ""); // allow only digits
        setInputValue(val);
        if (onChange) onChange(val); // update parent
    };

    const handleOtpChange = (e, index) => {
        const val = e.target.value;
        if (!/^\d?$/.test(val)) return;

        const updated = [...otpInputs];
        updated[index] = val;
        setOtpInputs(updated);

        if (val && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleSendOTP = async () => {
        if (countdown > 0 || !originalPhone) return;
        setProcessing(true);
        try {
            const { data } = await axios.post("/msg91/send-otp", { phone: originalPhone });
            if (data?.status) {
                successAlert(data.message || "OTP sent successfully!");
                setOtpSent(true);
                setCountdown(60);
                setOtpInputs(Array(6).fill(""));
            } else {
                errorAlert(data?.message || "Failed to send OTP");
            }
        } catch {
            errorAlert("Failed to send OTP. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const handleVerifyOTP = async () => {
        const otp = otpInputs.join("");
        if (otp.length !== 6) return errorAlert("Please enter a valid 6-digit OTP.");

        setOtpProcessing(true);
        try {
            const { data } = await axios.post("/msg91/verify-otp", { phone: originalPhone, otp });
            if (data?.status) {
                successAlert(data.message || "OTP verified successfully!");
                setIsVerified(true);
                setOtpSent(false);
                setOtpInputs(Array(6).fill(""));
                if (onVerified) onVerified(true, data);
            } else {
                errorAlert(data?.message || "Invalid OTP");
            }
        } catch {
            errorAlert("Verification failed. Please try again.");
        } finally {
            setOtpProcessing(false);
        }
    };

    // optionally mask phone
    const displayValue = maskPhone && inputValue.length >= 10
        ? `${inputValue.slice(0, 2)} XX XX XX ${inputValue.slice(-2)}`
        : inputValue;

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3">
                <div className="w-full relative">
                    <input
                        type="text"
                        value={displayValue}
                        onChange={handleInputChange}
                        className="w-full ring-0 block pr-24 p-2 rounded-md shadow-sm focus:ring-0 dark:bg-gray-800 dark:text-gray-300"
                        placeholder="10 Digit Phone Number"
                        disabled={isVerified || disabled}
                        required={isRequired}
                        maxLength={maxLen}
                    />

                    {!isVerified ? (
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            className="absolute right-2 top-1/2 -translate-y-1/2 py-1 px-3 text-sm font-medium text-gray-600 hover:text-indigo-600"
                            disabled={processing || countdown > 0 || !inputValue || inputValue.length < 10}
                        >
                            {processing
                                ? "Sending..."
                                : countdown > 0
                                    ? `Resend OTP ${countdown}s`
                                    : otpSent
                                        ? "Resend OTP"
                                        : "Get OTP"}
                        </button>
                    ) : (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 font-semibold">
                            ✅ Verified
                        </span>
                    )}
                </div>

                {otpSent && !isVerified && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {otpInputs.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-10 h-12 text-center text-lg font-bold border rounded-md dark:bg-gray-700 dark:text-white"
                                value={digit}
                                onChange={(e) => handleOtpChange(e, index)}
                                ref={(el) => (otpRefs.current[index] = el)}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={otpProcessing}
                            className="px-4 py-2 h-12 bg-indigo-600 text-white rounded-md"
                        >
                            {otpProcessing ? "Verifying..." : "✅ Verify OTP"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
